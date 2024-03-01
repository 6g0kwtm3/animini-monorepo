import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import { vitePlugin as remix } from "@remix-run/dev"
import { vercelPreset } from "@vercel/remix/vite"
import * as million from "million/compiler"
import { remixDevTools } from "remix-development-tools/vite"
import icons from "unplugin-icons/vite"
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
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true
			},
			presets: [vercelPreset()]
		}),
		tsconfigPaths(),
		million.vite({ auto: true, log: false }),
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
	}
})
