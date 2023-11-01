
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react-swc"
import houdini from "houdini/vite"

export default defineConfig({
  plugins: [houdini(), react({}), tsconfigPaths()],
  server: {
    port: 3000,
  },
  define: {
    "process.env.NODE_DEBUG": false,
  },
})
