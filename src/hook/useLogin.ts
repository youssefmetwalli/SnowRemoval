import { useState } from "react";
import { storeCurrentUser, type CurrentUser } from "./getCurrentUser";

type LoginResponse = {
  ok: boolean;
  user?: CurrentUser;
  error?: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      const data = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok || !data?.ok || !data.user) {
        setError(data?.error ?? "ログインIDまたはパスワードが正しくありません。");
        return null;
      }

      storeCurrentUser(data.user);
      return data.user;
    } catch (err) {
      console.error(err);
      setError("ログイン中にエラーが発生しました。");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
