import type { VercelRequest, VercelResponse } from '@vercel/node';
import { justdbFetch } from "./_lib/justdb";
import {
  methodNotAllowed,
  requireSession,
  safeLog,
  sendError,
} from "./_lib/security";

const allowedTables: Record<string, string[]> = {
  table_1754551086: ["GET", "PUT"],
  table_1756952069: ["GET"],
  table_1754549652: ["GET"],
  table_2000620006: ["GET"],
  table_1754541395: ["GET"],
  table_1754541394: ["GET"],
  table_1754541393: ["GET"],
};

const tableFromPath = (path: string) =>
  path.match(/^(table_\d+)\/records\/?(?:\?.*)?$/)?.[1];

const scopeWorkerQuery = (path: string, workerName: string) => {
  const [route, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("_field_workerName", workerName);
  return `${route}?${params.toString()}`;
};

const updateKey = (body: unknown) => {
  const record = (body as { records?: Array<{ recordKey?: Record<string, unknown> }> })
    ?.records?.[0];
  const id = record?.recordKey?.field_dayReportId;
  return typeof id === "string" ? id : null;
};

const refMatches = (value: unknown, id: string) =>
  Array.isArray(value) && value.map(String).includes(id);

const canUpdateOwnReport = async (body: unknown, workerName: string) => {
  const id = updateKey(body);
  if (!id) return false;

  const upstream = await justdbFetch(
    scopeWorkerQuery("table_1754551086/records/?limit=100", workerName)
  );
  if (!upstream.ok) return false;
  const reports = await upstream.json();
  return Array.isArray(reports) && reports.some((item) => {
    const data =
      item && typeof item === "object" && "record" in item
        ? (item as { record: Record<string, unknown> }).record
        : (item as Record<string, unknown>);
    return refMatches(data?.field_dayReportId, id);
  });
};

const sanitizeWorkers = (data: unknown) => {
  if (!Array.isArray(data)) return data;
  return data.map((item) => {
    if (!item || typeof item !== "object") return item;
    const source = item as Record<string, unknown>;
    if (source.record && typeof source.record === "object") {
      const {
        field_loginId: _loginId,
        field_password: _password,
        ...record
      } = source.record as Record<string, unknown>;
      return { ...source, record };
    }
    const {
      field_loginId: _loginId,
      field_password: _password,
      ...record
    } = source;
    return record;
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!req.method) return methodNotAllowed(res, ["GET", "POST", "PUT"]);
  const session = requireSession(req, res);
  if (!session) return;

  try {
    const path = String(req.query.path ?? "");
    const table = tableFromPath(path);
    if (!table || !allowedTables[table]?.includes(req.method)) {
      return sendError(res, 403, "Requested JustDB operation is not allowed.");
    }
    if (
      table === "table_1754551086" &&
      req.method === "PUT" &&
      !(await canUpdateOwnReport(req.body, session.name))
    ) {
      return sendError(res, 403, "Report update is not allowed.");
    }

    const apiName =
      req.query.apiName === "secondary" ||
      new URLSearchParams(path.split("?")[1]).get("apiName") === "secondary"
        ? "secondary"
        : "default";
    const scopedPath =
      req.method === "GET" &&
      (table === "table_1754551086" || table === "table_1756952069")
        ? scopeWorkerQuery(path, session.name)
        : path;
    const upstream = await justdbFetch(scopedPath, {
      method: req.method,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body || {})
          : undefined,
    }, apiName);

    const text = await upstream.text(); // may be JSON or empty
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") ?? "application/json");

    if (table === "table_1754549652" && text) {
      return res.send(JSON.stringify(sanitizeWorkers(JSON.parse(text))));
    }

    res.send(text || undefined);
  } catch (e) {
    safeLog("justdb_proxy_failed", {
      workerId: session.id,
      reason: e instanceof Error ? e.message : "unknown",
    });
    sendError(res, 500, "Proxy request failed.");
  }
}
