import { useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "./getCurrentUser";

type LoginResponse = {
  error?: string;
  message?: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    loginId: string,
    password: string
  ): Promise<CurrentUser | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = (await response.json().catch(() => null)) as
        | LoginResponse
        | null;

      if (!response.ok) {
        setError(
          data?.error ??
            data?.message ??
            "ログインIDまたはパスワードが正しくありません。"
        );
        return null;
      }

      const user = await fetchCurrentUser();
      if (!user) {
        setError("ログイン状態の確認に失敗しました。");
        return null;
      }

      return user;
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
