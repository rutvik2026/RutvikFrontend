import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://backend-8-tuix.onrender.com",
        changeOrigin: true,
      },
    },
    historyApiFallback: true, // Ensures SPA fallback for dev server
  },
  build: {
    rollupOptions: {
      input: "./index.html", // Ensure this is the correct entry point
    },
  },
  plugins: [react()],
});
