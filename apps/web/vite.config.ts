import { paraglide } from "@inlang/paraglide-vite"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tvTransform } from "m3-core"

import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import oxlintPlugin from "vite-plugin-oxlint"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		Inspect(),
		oxlintPlugin({ configFile: "../../oxlintrc.json" }),
		tvTransform(),
		tailwindcss(),

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
		sentryVitePlugin({
			org: "animini",
			project: "javascript-react",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	],
	server: { port: 3000 },
	build: { sourcemap: true },
	envPrefix: ["VITE_", "CF_", "NODE_"],
})
