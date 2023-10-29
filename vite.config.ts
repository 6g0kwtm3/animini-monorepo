import { unstable_vitePlugin as remix } from "@remix-run/dev"
import config from "./remix.config"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [remix(config), tsconfigPaths()],
  server:{
    port:3000
  },
  define: {
    "process.env.NODE_DEBUG": false,
  },
})
