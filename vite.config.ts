import react from "@vitejs/plugin-react-swc"
import houdini from "houdini/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [houdini(), react({}), tsconfigPaths()],
  server: {
    port: 3000,
  },
})
