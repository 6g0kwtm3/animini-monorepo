import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { reactRouter } from "@react-router/dev/vite"
import { sentryReactRouter as sentry } from "@sentry/react/vite"
import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig, type Plugin } from "vite"
import babel from "vite-plugin-babel"
import inspect from "vite-plugin-inspect"
import relay from "unplugin-relay/vite"
import macros from "unplugin-macros/vite"
import relayConfig from "./relay.config.json" with { type: "json" }
import path from "path"
import webpackStatsPlugin from "rollup-plugin-webpack-stats"

export default defineConfig((config) => {
	if (relayConfig.language !== "typescript") {
		throw new Error(`relayConfig.language !== "typescript"`)
	}
	return {
		plugins: [
			webpackStatsPlugin(),
			inspect(),
			macros(),
			tailwindcss(),
			babel({
				filter: /\.[jt]sx?$/,
				include: [
					"./app/**/*.tsx",
					"./node_modules/@animedes/components/src/**/*.tsx",
				],
				exclude: [/~icons/],
			}),
			paraglide({ project: "./project.inlang", outdir: "./app/paraglide" }),

			reactRouter(),

			icons({
				compiler: "jsx",
				jsx: "react",
				iconCustomizer(_collection, _icon, props) {
					props.width = "1em"
					props.height = "1em"
				},
			}),
			relay({
				language: relayConfig.language,
				eagerEsModules: relayConfig.eagerEsModules,
				artifactDirectory: path.resolve(relayConfig.artifactDirectory),
			}),
			sentry(
				{
					org: "animini",
					project: "javascript-react",
					authToken: process.env.SENTRY_AUTH_TOKEN,
					reactComponentAnnotation: { enabled: true },
				},
				config
			),
		],
		preview: { port: 3000, strictPort: true },
		server: { port: 3000, strictPort: true },
		build: {
			sourcemap: true,
			rollupOptions: {
				output: {
					assetFileNames: "assets/[name].[hash][extname]",
					chunkFileNames: "assets/[name].[hash].js",
					entryFileNames: "assets/[name].[hash].js",
				},
			},
		},
		resolve: { tsconfigPaths: true },
		envPrefix: ["VITE_", "CF_", "NODE_"],
	}
})
