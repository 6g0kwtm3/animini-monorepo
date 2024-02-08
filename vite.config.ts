import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import {
	unstable_vitePlugin as remix,
	unstable_cloudflarePreset as cloudflare
} from "@remix-run/dev"
import million from "million/compiler"
import { remixDevTools } from "remix-development-tools/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import svgr from "vite-plugin-svgr"

export default defineConfig({
	plugins: [
		svgr(),
		paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide"
		}),
		remixDevTools(),
		million.vite({ auto: true, mute: true }),
		remix({ ignoredRouteFiles: ["**/.*"], presets: [cloudflare()] }),
		tsconfigPaths()
	],
	server: {
		port: 3000
	},
	define: {
		"process.env.NODE_DEBUG": false
	}
})
