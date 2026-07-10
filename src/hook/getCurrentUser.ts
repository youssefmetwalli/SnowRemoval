const USER_KEY = "snowremovalUser";

export type CurrentUser = {
  id: string;
  name: string;
  workerRef: string[];
};

type UserSource = {
  id?: string | number;
  user_id?: string | number;
  worker_id?: string[] | string | number;
  workerId?: string[] | string | number;
  workerRef?: string[];
  name?: string;
  worker_name?: string;
  workerName?: string;
  user?: unknown;
};

const toRef = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined || value === "") return [];
  const id = String(value);
  return ["", id, "", id];
};

const toId = (value: unknown) => {
  if (Array.isArray(value)) return String(value[1] ?? value[0] ?? "");
  if (value === null || value === undefined) return "";
  return String(value);
};

const isRecord = (value: unknown): value is UserSource =>
  Boolean(value && typeof value === "object");

export const normalizeCurrentUser = (source: unknown): CurrentUser | null => {
  if (!isRecord(source)) return null;
  const user = isRecord(source.user) ? source.user : source;

  const id = toId(user.id ?? user.user_id ?? user.worker_id ?? user.workerId);
  const name = user.name ?? user.worker_name ?? user.workerName ?? "";
  const workerRef = user.workerRef ?? toRef(user.worker_id ?? user.workerId ?? id);

  if (!id || !name) return null;
  return { id, name, workerRef };
};

export const storeCurrentUser = (user: CurrentUser) => {
  localStorage.removeItem("loggedInUser");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  const rawUserData = localStorage.getItem(USER_KEY);
  let name: string | null = null;
  let userId: string[] | null = null;

  try {
    if (rawUserData) {
      const userData = JSON.parse(rawUserData) as CurrentUser;
      name = userData.name;
      userId = userData.workerRef;
    }
  } catch (error) {
    clearCurrentUser();
    console.error("Failed to parse current user data.", error);
  }

  return { name, userId };
};

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  const response = await fetch("/api/v1/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    clearCurrentUser();
    return null;
  }

  const data = (await response.json().catch(() => null)) as UserSource | null;
  const user = normalizeCurrentUser(data);
  if (!user) {
    clearCurrentUser();
    return null;
  }

  storeCurrentUser(user);
  return user;
};
