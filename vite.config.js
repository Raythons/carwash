import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Exclude node_modules CSS to prevent conflicts with libraries like react-toastify
      content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    }),
  ],
  css: {
    devSourcemap: true,
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
