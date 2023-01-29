import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/dictionaries": "http://localhost:3000",
      "/solve": "http://localhost:3000",
    },
  },
});
