import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy:{
      "/api": {
        target: "http://192.168.41.5:6020/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/resource": {
        target: "http://192.168.41.5:6020/resource",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resource/, ""),
      },
    }
  },
});
