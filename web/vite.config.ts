import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      "/api": "http://localhost:4099",
    },
  },
});
