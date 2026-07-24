import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../test/msw-handlers";
import { useLogin } from "./useLogin";
import { clearCurrentUser, getCurrentUser } from "./getCurrentUser";

describe("useLogin", () => {
  beforeEach(() => {
    clearCurrentUser();
  });

  it("正しい ID/パスワードで /api/v1/auth と /auth/me が叩かれ localStorage に保存される", async () => {
    const { result } = renderHook(() => useLogin());

    let user;
    await act(async () => {
      user = await result.current.login("worker01", "pw");
    });

    expect(user).toMatchObject({
      id: "1",
      name: "テスト作業員",
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeNull();

    const stored = getCurrentUser();
    expect(stored.name).toBe("テスト作業員");
  });

  it("401 応答時は null を返し error を設定する", async () => {
    server.use(
      http.post("/api/v1/auth", () =>
        HttpResponse.json({ success: false }, { status: 401 })
      )
    );

    const { result } = renderHook(() => useLogin());

    let ret;
    await act(async () => {
      ret = await result.current.login("worker01", "wrong");
    });

    expect(ret).toBeNull();
    await waitFor(() => {
      expect(result.current.error).toBe("ログインIDまたはパスワードが正しくありません。");
    });
    expect(getCurrentUser().name).toBeNull();
  });

  it("success: false で 200 応答時も error を設定する", async () => {
    server.use(
      http.post("/api/v1/auth", () =>
        HttpResponse.json({ success: false, role: "worker", name: "" })
      )
    );

    const { result } = renderHook(() => useLogin());

    let ret;
    await act(async () => {
      ret = await result.current.login("worker01", "pw");
    });

    expect(ret).toBeNull();
    expect(result.current.error).toBe("ログインIDまたはパスワードが正しくありません。");
  });
});
