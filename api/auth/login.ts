import type { VercelRequest, VercelResponse } from "@vercel/node";
import { justdbFetch, normalizeRecords } from "../_lib/justdb";
import {
  enforceRateLimit,
  issueSession,
  methodNotAllowed,
  readJsonBody,
  requestIp,
  safeLog,
  sendError,
} from "../_lib/security";

type LoginBody = {
  loginId?: unknown;
  password?: unknown;
};

type WorkerRecord = {
  field_loginId?: string;
  field_password?: string;
  field_1754549790?: string;
  field_1754635302?: string[];
};

const invalidLogin = (res: VercelResponse) =>
  sendError(res, 401, "ユーザーIDまたはパスワードが正しくありません。");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const ip = requestIp(req);
  if (!enforceRateLimit(`login:${ip}`, 10, 10 * 60 * 1000, res)) return;

  try {
    const body = readJsonBody<LoginBody>(req);
    const loginId =
      typeof body?.loginId === "string" ? body.loginId.trim().slice(0, 120) : "";
    const password =
      typeof body?.password === "string" ? body.password.slice(0, 240) : "";
    if (!loginId || !password) return invalidLogin(res);

    const upstream = await justdbFetch("table_1754549652/records/?limit=100");
    if (!upstream.ok) throw new Error(`Worker lookup failed: ${upstream.status}`);
    const workers = normalizeRecords<WorkerRecord>(await upstream.json());
    const matched = workers.find(
      (worker) =>
        worker.field_loginId?.trim() === loginId &&
        worker.field_password === password
    );
    const workerRef = matched?.field_1754635302?.map(String) ?? [];
    const workerId = workerRef[1] ?? workerRef[0];
    const name = matched?.field_1754549790?.trim();
    if (!matched || !workerId || !name) return invalidLogin(res);

    issueSession(res, { id: workerId, name, workerRef });
    safeLog("login_success", { workerId, ip });
    res.status(200).json({
      ok: true,
      user: { id: workerId, name, workerRef },
    });
  } catch (error) {
    safeLog("login_failed", {
      ip,
      reason: error instanceof Error ? error.message : "unknown",
    });
    sendError(res, 500, "ログイン処理を完了できませんでした。");
  }
}
