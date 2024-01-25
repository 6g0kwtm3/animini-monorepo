import { unstable_vitePlugin as remix } from "@remix-run/dev"
import million from "million/compiler"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import config from "./remix.config"
import { remixDevTools } from "remix-development-tools/vite"

export default defineConfig({
	plugins: [
		remixDevTools(),
		million.vite({ auto: true, mute: true }),
		remix(config),
		tsconfigPaths()
	],
	server: {
		port: 3000
	},
	define: {
		"process.env.NODE_DEBUG": false
	}
})
