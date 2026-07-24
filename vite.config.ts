import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(async ({ mode }) => {
  // Load ESM-only plugin safely (works for default or named export)
  const mod = await import("@animaapp/vite-plugin-screen-graph");
  const screenGraph = (mod as any).default ?? (mod as any).screenGraphPlugin;

  return {
    plugins: [
      react(),
      mode === "development" && screenGraph?.(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"],
        manifest: {
          name: "アセラ除雪日報",
          short_name: "除雪日報",
          description: "現場作業員向け除雪日報 PWA",
          theme_color: "#1e406f",
          background_color: "#1e406f",
          display: "standalone",
          orientation: "portrait",
          start_url: "./",
          scope: "./",
          icons: [
            {
              src: "icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
          navigateFallbackDenylist: [/^\/api\//, /^\/n8n\//],
          runtimeCaching: [
            {
              urlPattern: /^.*\/api\/v1\/.*$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 32, maxAgeSeconds: 300 },
              },
            },
            {
              urlPattern: /^.*\/n8n\/.*$/,
              handler: "NetworkOnly",
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    server: {
      proxy: {
        "/api/v1": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
        "/n8n": {
          target: "http://localhost:5678",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/n8n/, ""),
        },
      },
    },
  };
});
