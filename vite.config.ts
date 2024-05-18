import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import {
	cloudflareDevProxyVitePlugin as cloudflareDevProxy,
	vitePlugin as remix
} from "@remix-run/dev"

import { remixDevTools } from "remix-development-tools"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import envOnly from "vite-env-only"
import tsconfigPaths from "vite-tsconfig-paths"
import million from "million/compiler"

export default defineConfig({
	plugins: [
		paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide"
		}),
		envOnly(),
		remixDevTools(),
		cloudflareDevProxy(),
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				unstable_singleFetch: true
			}
		}),
		tsconfigPaths(),
		million.vite({ auto: true, rsc: true, log: false }),
		icons({
			compiler: "jsx",
			jsx: "react",
			iconCustomizer(_collection, _icon, props) {
				props.width = "1em"
				props.height = "1em"
			}
		})
	],
	server: {
		port: 3000
	},
	define: {
		__BUSTER__:
			`${Date.now()}` || process.env.NODE_ENV === "production"
				? `${Date.now()}`
				: "`${Date.now()}`"
	}
})

declare global {
	const __BUSTER__: string
}
