// vite.config.ts
import { defineConfig } from "file:///home/sanenchen/Desktop/Codes/Projects/eGZ/eGZ-GZTV/GZTV-front/node_modules/vite/dist/node/index.js";
import react from "file:///home/sanenchen/Desktop/Codes/Projects/eGZ/eGZ-GZTV/GZTV-front/node_modules/@vitejs/plugin-react/dist/index.mjs";
import UnoCSS from "file:///home/sanenchen/Desktop/Codes/Projects/eGZ/eGZ-GZTV/GZTV-front/node_modules/unocss/dist/vite.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: "0.0.0.0",
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://192.168.41.5:6020/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/resource": {
        target: "http://192.168.41.5:6020/resource",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resource/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYW5lbmNoZW4vRGVza3RvcC9Db2Rlcy9Qcm9qZWN0cy9lR1ovZUdaLUdaVFYvR1pUVi1mcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvc2FuZW5jaGVuL0Rlc2t0b3AvQ29kZXMvUHJvamVjdHMvZUdaL2VHWi1HWlRWL0daVFYtZnJvbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvc2FuZW5jaGVuL0Rlc2t0b3AvQ29kZXMvUHJvamVjdHMvZUdaL2VHWi1HWlRWL0daVFYtZnJvbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IFVub0NTUyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBVbm9DU1MoKV0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgcHJveHk6e1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xOTIuMTY4LjQxLjU6NjAyMC9hcGlcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICB9LFxuICAgICAgXCIvcmVzb3VyY2VcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzE5Mi4xNjguNDEuNTo2MDIwL3Jlc291cmNlXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Jlc291cmNlLywgXCJcIiksXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VyxTQUFTLG9CQUFvQjtBQUN6WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBQUEsRUFDM0IsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTTtBQUFBLE1BQ0osUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsTUFDQSxhQUFhO0FBQUEsUUFDWCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsZUFBZSxFQUFFO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
