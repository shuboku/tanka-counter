import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  root: ".",  
  publicDir: "public", 
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), 
    },
  },
  build: {
    outDir: "dist",       emptyOutDir: true,
  },
});