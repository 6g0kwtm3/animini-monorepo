import { unstable_vitePlugin as remix } from "@remix-run/dev"
import houdini from "houdini/vite"
import million from "million/compiler"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import config from "./remix.config"

import Inspect from "vite-plugin-inspect"

export default defineConfig({
	plugins: [
		Inspect(),
		houdini(),
		million.vite({ auto: true }),
		remix(config),
		tsconfigPaths(),
	],

	server: {
		port: 3000,
	},
	define: {
		"process.env.NODE_DEBUG": false,
	},
})
