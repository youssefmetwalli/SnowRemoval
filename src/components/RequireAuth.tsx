import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser } from "../hook/getCurrentUser";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading"
  );

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const user = await fetchCurrentUser();
        if (active) setState(user ? "ready" : "missing");
      } catch {
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
