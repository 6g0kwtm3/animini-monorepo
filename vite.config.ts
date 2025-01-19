import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import { reactRouter } from "@react-router/dev/vite"
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		// MillionLint.vite(),
		paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide",
		}),

		// remixDevTools(),
		cloudflareDevProxy(),
		reactRouter(),

		// million.vite({
		// 	auto: true,
		// 	// rsc: true,
		// 	log: false
		// }),
		tsconfigPaths(),
		icons({
			compiler: "jsx",
			jsx: "react",
			iconCustomizer(_collection, _icon, props) {
				props.width = "1em"
				props.height = "1em"
			},
		}),
		relay,
	],
	server: {
		port: 3000,
	},
	define: {
		"process.env.NODE_DEBUG": process.env.NODE_DEBUG,
		__BUSTER__:
			`${Date.now()}` || process.env.NODE_ENV === "production"
				? `${Date.now()}`
				: "`${Date.now()}`",
	},
})
declare global {
	const __BUSTER__: string
}
