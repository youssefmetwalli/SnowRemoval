import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getSession,
  methodNotAllowed,
  safeLog,
  sendError,
} from "../_lib/security";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const session = getSession(req);
    if (!session) return sendError(res, 401, "Authentication required.");

    res.status(200).json({
      ok: true,
      user: {
        id: session.id,
        name: session.name,
        workerRef: session.workerRef,
      },
    });
  } catch (error) {
    safeLog("session_endpoint_failed", {
      reason: error instanceof Error ? error.message : "unknown",
    });
    sendError(res, 500, "Session configuration is unavailable.");
  }
}
