import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  clearCurrentUser,
  storeCurrentUser,
  type CurrentUser,
} from "../hook/getCurrentUser";

type SessionResponse = {
  ok: boolean;
  user?: CurrentUser;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading"
  );

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json().catch(() => null)) as
          | SessionResponse
          | null;
        if (!response.ok || !data?.ok || !data.user) {
          clearCurrentUser();
          if (active) setState("missing");
          return;
        }

        storeCurrentUser(data.user);
        if (active) setState("ready");
      } catch {
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
