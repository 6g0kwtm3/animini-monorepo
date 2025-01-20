import { paraglide } from "@inlang/paraglide-js-adapter-vite"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"
import babel from "vite-plugin-babel"

export default defineConfig({
	plugins: [
		babel({
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [
					["babel-plugin-relay"],
					["babel-plugin-react-compiler", { target: "18" }],
				],
			},
			filter: /\.[jt]sx?$/,
			include: [
				"app/routes/**/*.tsx",
				"app/components/**/*.tsx",
				"app/lib/**/*.tsx",
			],
		}),
		// MillionLint.vite(),
		paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide",
		}),

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
			org: "patryk-pi",
			project: "javascript-react",
		}),
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
	build: {
		sourcemap: true,
	},
})
declare global {
	const __BUSTER__: string
}
