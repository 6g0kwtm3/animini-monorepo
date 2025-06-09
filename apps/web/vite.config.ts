import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin as sentry } from "@sentry/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import inspect from "vite-plugin-inspect"
import oxlint from "vite-plugin-oxlint"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		inspect(),
		oxlint({ configFile: "./node_modules/oxlint-config/oxlintrc.json" }),

		tailwindcss(),
		babel({ filter: /\.[jt]sx?$/, exclude: [/~icons/, /framer-motion/] }),
		paraglide({ project: "./project.inlang", outdir: "./app/paraglide" }),

		reactRouter(),

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
		sentry({
			org: "animini",
			project: "javascript-react",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	],
	server: { port: 3000 },
	build: { sourcemap: true },
	envPrefix: ["VITE_", "CF_", "NODE_"],
})
