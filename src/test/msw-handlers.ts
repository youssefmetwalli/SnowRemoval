import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const defaultHandlers = [
  http.post("/api/v1/auth", async ({ request }) => {
    const body = (await request.json()) as { login_id?: string; password?: string };
    if (body.login_id === "worker01" && body.password === "pw") {
      return HttpResponse.json({
        success: true,
        role: "worker",
        name: "テスト作業員",
      });
    }
    return HttpResponse.json({ success: false }, { status: 401 });
  }),

  http.get("/api/v1/auth/me", () => {
    return HttpResponse.json({
      id: "1",
      name: "テスト作業員",
      workerRef: ["worker", "1", "worker01", "テスト作業員"],
      role: "worker",
    });
  }),
];

export const server = setupServer(...defaultHandlers);
