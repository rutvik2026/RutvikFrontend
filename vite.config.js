import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://backend-8-tuix.onrender.com", 
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
