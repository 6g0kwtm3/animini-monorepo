import { paraglide } from "@inlang/paraglide-vite"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import oxlintPlugin from "vite-plugin-oxlint"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		oxlintPlugin({
			configFile: "./oxlintrc.json",
		}),
		// MillionLint.vite(),
		// paraglide({
		// 	project: "./project.inlang",
		// 	outdir: "./app/paraglide",
		// }),

		// remixDevTools(),
		// cloudflareDevProxy(),

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
		sentryVitePlugin({
			org: "animini",
			project: "javascript-react",
		}),
	],
	server: {
		port: 3000,
	},
	define: {
		"process.env.NODE_DEBUG": process.env.NODE_DEBUG,
	},
	build: {
		sourcemap: true,
	},
})
