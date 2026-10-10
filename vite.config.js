import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Chuyển /api/* sang BE khi dev → cùng origin, không vướng CORS
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});
