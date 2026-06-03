import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseReportRequest } from "./_lib/reports";
import {
  enforceRateLimit,
  methodNotAllowed,
  requestIp,
  requireSession,
  safeLog,
  sendError,
  toWebRequest,
} from "./_lib/security";

const n8nWebhookUrl = () => process.env.N8N_REPORT_WEBHOOK_URL;

const n8nAuthHeader = () =>
  process.env.N8N_REPORT_AUTH_HEADER ?? "x-snow-report-secret";

const forwardedResponse = async (upstream: Response, res: VercelResponse) => {
  const text = await upstream.text();
  if (!upstream.ok) {
    return sendError(res, 502, "日報保存サービスが送信を完了できませんでした。");
  }
  const contentType = upstream.headers.get("content-type");
  if (contentType) res.setHeader("Content-Type", contentType);
  res.status(upstream.status).send(text || undefined);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const session = requireSession(req, res);
  if (!session) return;
  const ip = requestIp(req);
  if (!enforceRateLimit(`reports:${session.id}:${ip}`, 20, 60 * 1000, res)) return;

  try {
    const webhookUrl = n8nWebhookUrl();
    const webhookSecret = process.env.N8N_REPORT_WEBHOOK_SECRET;
    if (!webhookUrl || !webhookSecret) {
      throw new Error("n8n report webhook is not configured.");
    }

    const validated = await parseReportRequest(await toWebRequest(req), session);
    const hasMultipartParts =
      validated.images.length > 0 ||
      validated.tachometerValue !== undefined ||
      validated.tachometerMemos !== undefined;
    const headers: Record<string, string> = {
      [n8nAuthHeader()]: webhookSecret,
    };
    let body: string | FormData;

    if (hasMultipartParts) {
      const form = new FormData();
      form.append("report", JSON.stringify(validated.report));
      if (validated.tachometerValue !== undefined) {
        form.append("tachometerValue", validated.tachometerValue);
      }
      if (validated.tachometerMemos !== undefined) {
        form.append("tachometerMemos", JSON.stringify(validated.tachometerMemos));
      }
      validated.images.forEach((image) => {
        form.append("images", image.blob, image.fileName);
      });
      body = form;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(validated.report);
    }

    const upstream = await fetch(webhookUrl, { method: "POST", headers, body });

    safeLog("report_forwarded", {
      workerId: session.id,
      images: validated.images.length,
      upstreamStatus: upstream.status,
    });
    await forwardedResponse(upstream, res);
  } catch (error) {
    safeLog("report_rejected", {
      workerId: session.id,
      ip,
      reason: error instanceof Error ? error.message : "unknown",
    });
    const configurationError =
      error instanceof Error && error.message.includes("configured");
    const message =
      error instanceof Error &&
      !configurationError &&
      !error.message.includes("fetch")
        ? error.message
        : "日報の送信処理を完了できませんでした。";
    sendError(
      res,
      configurationError ? 500 : error instanceof SyntaxError ? 400 : 422,
      message
    );
  }
}
