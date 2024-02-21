import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import {
	cloudflareDevProxyVitePlugin as cloudflareDevProxy,
	vitePlugin as remix
} from "@remix-run/dev"
import * as million from "million/compiler"
import { remixDevTools } from "remix-development-tools/vite"
import { defineConfig } from "vite"
import envOnly from "vite-env-only"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide"
		}),
		envOnly(),
		remixDevTools(),
		cloudflareDevProxy(),
		remix({}),
		tsconfigPaths(),
		million.vite({ auto: true, log: false })
	],
	server: {
		port: 3000
	}
})
