import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import mdComputer from "md-computer/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), mdComputer()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
