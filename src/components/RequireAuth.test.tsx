import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../test/msw-handlers";
import { RequireAuth } from "./RequireAuth";
import { clearCurrentUser } from "../hook/getCurrentUser";

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <RequireAuth>
              <div data-testid="protected">SECRET</div>
            </RequireAuth>
          }
        />
        <Route path="/loginscreen" element={<div data-testid="login">LOGIN</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("RequireAuth", () => {
  it("/auth/me が 200 なら children を描画する", async () => {
    clearCurrentUser();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId("protected")).toBeInTheDocument();
    });
  });

  it("/auth/me が 401 なら /loginscreen にリダイレクトする", async () => {
    clearCurrentUser();
    server.use(
      http.get("/api/v1/auth/me", () =>
        HttpResponse.json({ error: "unauthorized" }, { status: 401 })
      )
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
    });
  });

  it("/auth/me が 200 でも body に id が無いなら redirect する", async () => {
    clearCurrentUser();
    server.use(
      http.get("/api/v1/auth/me", () => HttpResponse.json({}))
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
    });
  });
});
