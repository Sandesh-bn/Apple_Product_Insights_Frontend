import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/", 
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  optimizeDeps: {
    include: ["react-simple-maps", "d3-scale", "d3-scale-chromatic", "prop-types"],
  },
});