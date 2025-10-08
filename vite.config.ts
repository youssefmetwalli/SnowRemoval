import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";

export default defineConfig(async ({ mode }) => {
  // Load ESM-only plugin safely (works for default or named export)
  const mod = await import("@animaapp/vite-plugin-screen-graph");
  const screenGraph = (mod as any).default ?? (mod as any).screenGraphPlugin;

  return {
    plugins: [react(), mode === "development" && screenGraph?.()],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://asera.just-db.com/sites/api/services/v1/tables/",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
