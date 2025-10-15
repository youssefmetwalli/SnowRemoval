import { useState } from "react";
import { apiClient } from "../lib/apiClient";

interface Worker {
  field_loginId: string;     
  field_password: string;    
  field_作業員名?: string;
  field_作業員ID?: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.get<Worker[]>("table_1754549652/records/");

      if (!data || !Array.isArray(data)) {
        setError("サーバーからの応答が無効です。");
        return null;
      }

      // Match using correct lowercase keys
      const matched = data.find(
        (worker) =>
          worker.field_loginId?.trim() === loginId.trim() &&
          worker.field_password?.trim() === password.trim()
      );

      if (!matched) {
        setError("ログインIDまたはパスワードが正しくありません。");
        return null;
      }

      // Save user data (optional)
      localStorage.setItem("loggedInUser", JSON.stringify(matched));
      return matched;
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
