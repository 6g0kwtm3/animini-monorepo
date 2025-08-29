import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin as sentry } from "@sentry/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import inspect from "vite-plugin-inspect"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	build: { sourcemap: true },
	envPrefix: ["VITE_", "CF_", "NODE_"],
	plugins: [
		inspect(),
		tailwindcss(),
		babel({
			exclude: [/~icons/],
			filter: /\.[jt]sx?$/,
			include: ["./app/**/*.tsx"],
		}),
		paraglide({ outdir: "./app/paraglide", project: "./project.inlang" }),

		reactRouter(),

		tsconfigPaths(),
		icons({
			compiler: "jsx",
			iconCustomizer(_collection, _icon, props) {
				props.width = "1em"
				props.height = "1em"
			},
			jsx: "react",
		}),
		relay,
		sentry({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: "animini",
			project: "javascript-react",
		}),
	],
	preview: { port: 3000 },
	server: { port: 3000 },
})
