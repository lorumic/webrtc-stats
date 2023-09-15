import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "./src",
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "../build",
    rollupOptions: {
      input: {
        index: fileURLToPath(
          new URL("./src/index.html", import.meta.url)
        ),
      },
    },
  },
});
