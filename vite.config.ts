import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import {
	unstable_cloudflarePreset as cloudflare,
	unstable_vitePlugin as remix
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
		remix({
			presets: [cloudflare()], 
		}),
		tsconfigPaths(),
		million.vite({ auto: true, log: false })
	],
	ssr: {
		resolve: {
			externalConditions: ["workerd", "worker"]
		}
	},
	server: {
		port: 3000
	}
})
