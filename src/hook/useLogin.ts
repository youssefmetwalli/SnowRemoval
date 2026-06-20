import { useState } from "react";
import { storeCurrentUser, type CurrentUser } from "./getCurrentUser";
import { apiClient } from "../lib/apiClient";

type AuthLoginResponse = {
  success: boolean;
  role: "worker" | "admin";
  name: string;
  token?: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (loginId: string, password: string): Promise<CurrentUser | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. ログイン認証の実行 (josetsu_console /api/v1/auth)
      const loginData = await apiClient.post<AuthLoginResponse>("auth", {
        login_id: loginId,
        password,
      });

      if (!loginData.success) {
        setError("ログインIDまたはパスワードが正しくありません。");
        return null;
      }

      // 2. セッションプロフィールの取得 (/api/v1/auth/me)
      const meData = await apiClient.get<CurrentUser & { role: string }>("auth/me");

      // 3. ローカルキャッシュの保存
      storeCurrentUser(meData);
      return meData;
    } catch (err: any) {
      console.error(err);
      setError("ログインIDまたはパスワードが正しくありません。");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
