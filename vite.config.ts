import { unstable_vitePlugin as remix } from "@remix-run/dev"
import config from "./remix.config"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [remix(config), tsconfigPaths()],
  define: {
    "process.env.NODE_DEBUG": false,
  },
})
