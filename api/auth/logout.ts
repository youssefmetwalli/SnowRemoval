import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearSession, methodNotAllowed } from "../_lib/security";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  clearSession(res);
  res.status(200).json({ ok: true });
}
