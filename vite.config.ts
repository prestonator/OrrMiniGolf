import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["**/*.{glb,gltf,jpg,jpeg,png,svg,ico}"],
      manifest: {
        name: "1889 Land Rush",
        short_name: "Land Rush",
        display: "fullscreen",
        theme_color: "#4a2e15",
        background_color: "#f4ecd8",
        icons: [
          {
            src: "favicon.ico",
            sizes: "any",
            type: "image/x-icon",
          },
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "apple-touch-icon.png", // Often just a copy of the 192x192
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10485760,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,glb,gltf,jpg,jpeg}"],
        navigateFallbackDenylist: [/^\/rest\/v1/, /^\/rpc/, /api\.stripe\.com/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return (
                url.pathname.includes("/rest/v1/") ||
                url.pathname.includes("/rpc/") ||
                url.hostname.includes("stripe.com") ||
                url.hostname.includes("supabase")
              );
            },
            handler: "NetworkOnly",
            options: {
              cacheName: "api-network-only",
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
