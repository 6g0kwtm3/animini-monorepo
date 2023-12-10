import { unstable_vitePlugin as remix } from "@remix-run/dev"
import million from "million/compiler"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import config from "./remix.config"

export default defineConfig({
	plugins: [million.vite({ auto: true }), remix(config), tsconfigPaths()],
	server: {
		port: 3000,
	},
	define: {
		"process.env.NODE_DEBUG": false,
	},
})
