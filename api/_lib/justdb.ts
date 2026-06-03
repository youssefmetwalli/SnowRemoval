const JUSTDB_BASE = "https://asera.just-db.com/sites/api/services/v1/tables";

type ApiName = "default" | "secondary";

const getKey = (apiName: ApiName) => {
  const key =
    apiName === "secondary"
      ? process.env.JUSTDB_SECONDARY_API_KEY
      : process.env.JUSTDB_API_KEY;

  if (!key) {
    throw new Error(`Missing JustDB ${apiName} API key.`);
  }
  return key;
};

export const justdbUrl = (path: string) =>
  `${JUSTDB_BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

export const justdbFetch = (
  path: string,
  init: RequestInit = {},
  apiName: ApiName = "default"
) =>
  fetch(justdbUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey(apiName)}`,
      ...(init.headers ?? {}),
    },
  });

export const normalizeRecords = <T>(data: unknown): T[] => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    if (item && typeof item === "object" && "record" in item) {
      return (item as { record: T }).record;
    }
    return item as T;
  });
};
