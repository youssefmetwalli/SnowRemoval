import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SESSION_COOKIE = "snowremoval_session";
const SESSION_AGE_SECONDS = 60 * 60 * 12;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export type SessionUser = {
  id: string;
  name: string;
  workerRef: string[];
};

type SessionPayload = SessionUser & {
  exp: number;
};

export const safeLog = (
  event: string,
  details: Record<string, string | number | boolean | undefined> = {}
) => {
  console.info(`[snowremoval] ${event}`, details);
};

export const sendError = (
  res: VercelResponse,
  status: number,
  message: string
) => {
  res.status(status).json({ ok: false, error: message });
};

export const methodNotAllowed = (
  res: VercelResponse,
  allowed: string[]
) => {
  res.setHeader("Allow", allowed.join(", "));
  sendError(res, 405, "Method not allowed.");
};

const base64url = (value: string | Buffer) =>
  Buffer.from(value).toString("base64url");

const sign = (value: string) => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }
  return createHmac("sha256", secret).update(value).digest("base64url");
};

const signaturesMatch = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

const parseCookies = (header?: string) =>
  Object.fromEntries(
    (header ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...value] = part.split("=");
        return [name, decodeURIComponent(value.join("="))];
      })
  );

export const issueSession = (res: VercelResponse, user: SessionUser) => {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + SESSION_AGE_SECONDS * 1000,
  };
  const encoded = base64url(JSON.stringify(payload));
  const value = `${encoded}.${sign(encoded)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_AGE_SECONDS}${secure}`
  );
};

export const clearSession = (res: VercelResponse) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`
  );
};

export const getSession = (req: VercelRequest): SessionUser | null => {
  const value = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!value) return null;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  try {
    if (!signaturesMatch(sign(encoded), signature)) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SessionPayload;
    if (
      !payload.id ||
      !payload.name ||
      !Array.isArray(payload.workerRef) ||
      payload.exp <= Date.now()
    ) {
      return null;
    }

    return {
      id: String(payload.id),
      name: String(payload.name),
      workerRef: payload.workerRef.map(String),
    };
  } catch {
    return null;
  }
};

export const requireSession = (
  req: VercelRequest,
  res: VercelResponse
): SessionUser | null => {
  try {
    const session = getSession(req);
    if (!session) {
      sendError(res, 401, "Authentication required.");
      return null;
    }
    return session;
  } catch (error) {
    safeLog("session_check_failed", {
      reason: error instanceof Error ? error.message : "unknown",
    });
    sendError(res, 500, "Session configuration is unavailable.");
    return null;
  }
};

export const requestIp = (req: VercelRequest) => {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
};

export const enforceRateLimit = (
  key: string,
  limit: number,
  windowMs: number,
  res: VercelResponse
) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  const entry =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

  entry.count += 1;
  rateLimitStore.set(key, entry);
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(limit - entry.count, 0)));

  if (entry.count <= limit) return true;

  res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
  sendError(res, 429, "Too many requests. Please try again later.");
  return false;
};

export const readJsonBody = <T>(req: VercelRequest): T | null => {
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as T;
  }
  if (req.body && typeof req.body === "object") {
    return req.body as T;
  }
  return null;
};

export const toWebRequest = async (req: VercelRequest) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const body = chunks.length
    ? Buffer.concat(chunks)
    : req.body
      ? Buffer.from(
          typeof req.body === "string" ? req.body : JSON.stringify(req.body)
        )
      : undefined;
  const protocol = req.headers["x-forwarded-proto"] ?? "http";
  const host = req.headers.host ?? "localhost";

  const headers = new Headers();
  Object.entries(req.headers).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((part) => headers.append(name, part));
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  });

  return new Request(`${protocol}://${host}${req.url ?? "/"}`, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
  });
};
