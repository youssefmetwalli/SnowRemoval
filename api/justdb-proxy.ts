import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { path = "", apiName="defalut" } = req.query;
    const JUSTDB_BASE = "https://asera.just-db.com/sites/api/services/v1/tables";
    // const API_KEY = process.env.VITE_API_KEY; // safe on server only
    // const SECOND_KEY = process.env.VITE_API_NO_TWO;

    const API_KEYS = {
      default: process.env.VITE_API_KEY,
      secondary: process.env.VITE_API_NO_TWO,
    };

    const API_KEY = API_KEYS[String(apiName) as keyof typeof API_KEYS] || API_KEYS.default;
    
    const targetUrl =
      JUSTDB_BASE.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body || {})
          : undefined,
    });

    const text = await upstream.text(); // may be JSON or empty
    res.status(upstream.status);

    // ✅ optional CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    res.send(text);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
