import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  clearCurrentUser,
  storeCurrentUser,
  type CurrentUser,
} from "../hook/getCurrentUser";
import { apiClient } from "../lib/apiClient";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading"
  );

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // セッション確認API (/api/v1/auth/me) の呼び出し
        const user = await apiClient.get<CurrentUser>("auth/me");

        if (user && user.id) {
          storeCurrentUser(user);
          if (active) setState("ready");
        } else {
          clearCurrentUser();
          if (active) setState("missing");
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        clearCurrentUser();
        if (active) setState("missing");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return <div className="p-6 text-center text-gray-500">確認中...</div>;
  }

  if (state === "missing") {
    return <Navigate to="/loginscreen" replace />;
  }

  return <>{children}</>;
};
