import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin as sentry } from "@sentry/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import inspect from "vite-plugin-inspect"
import relay from "unplugin-relay/vite"
import macros from "unplugin-macros/vite"
import relayConfig from "./relay.config.json" with { type: "json" }
import path from "path"

if (relayConfig.language !== "typescript") {
	throw new Error(`relayConfig.language !== "typescript"`)
}

export default defineConfig({
	devtools: { build: { withApp: true } },
	plugins: [
		inspect({ build: true }),
		createReactCompilerPlugin({}, /\.[tj]sx?$/, /\/node_modules\//, {}),
		macros(),
		tailwindcss(),
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
		sentry({
			org: "animini",
			project: "javascript-react",
			authToken: process.env.SENTRY_AUTH_TOKEN,
			reactComponentAnnotation: { enabled: true },
		}),
	],
	preview: { port: 3000 },
	server: { port: 3000 },
	build: { sourcemap: true },
	resolve: { tsconfigPaths: true },
	envPrefix: ["VITE_", "CF_", "NODE_"],
})

import type { Options, ReactCompilerOptions } from "@vitejs/plugin-react"
import { transform } from "oxc-transform-react"
import type { Plugin, ResolvedConfig } from "vite"

function createReactCompilerPlugin(
	options: ReactCompilerOptions,
	include: NonNullable<Options["include"]>,
	exclude: NonNullable<Options["exclude"]>,
	reactOptions: Pick<Options, "jsxImportSource" | "jsxRuntime">
): Plugin {
	function isFastRefreshEnabled() {
		return (
			!config.isProduction
			&& config.command !== "build"
			&& config.server.hmr !== false
		)
	}
	let config: ResolvedConfig
	let sourcemap = true
	let jsxDevelopment = false
	const runtime =
		options.target === "17" || options.target === "18"
			? "react-compiler-runtime"
			: "react/compiler-runtime"

	return {
		name: "vite:react-compiler",
		enforce: "pre",
		config() {
			return { optimizeDeps: { include: [runtime] } }
		},
		configResolved(resolvedConfig) {
			sourcemap =
				resolvedConfig.command !== "build" || !!resolvedConfig.build.sourcemap
			jsxDevelopment = !resolvedConfig.isProduction
			config = resolvedConfig
		},
		transform: {
			filter: { id: { include: include, exclude: exclude } },
			async handler(code, id) {
				const isClient = this.environment.config.consumer !== "server"
				const shouldCompile =
					isClient
					&& (options.compilationMode === "annotation"
						? /['"]use memo['"]/.test(code)
						: defaultCodeFilter.test(code))
				const filename = id.split("?")[0]
				if (!filename) {
					void this.error(`Invalid id: ${id}`)
					return
				}
				// The config hook is not called when the plugin is used with Rolldown directly.

				const result = await transform(filename, code, {
					jsx: {
						runtime: reactOptions.jsxRuntime,
						development: jsxDevelopment,
						importSource: reactOptions.jsxImportSource,
						refresh: isClient && isFastRefreshEnabled(),
					},
					reactCompiler: shouldCompile ? options : false,
					sourcemap,
				})
				const diagnostics = result.errors.map(
					(error) =>
						`${error.message}${error.codeframe ? `\n${error.codeframe}` : ""}`
				)

				if (result.fatal) {
					void this.error(
						diagnostics.join("\n\n") || "React Compiler transform failed."
					)
				}
				for (const diagnostic of diagnostics) {
					this.warn(diagnostic)
				}

				return { code: result.code, map: result.map }
			},
		},
	}
}
const defaultCodeFilter = /forwardRef|memo|\b(?:[A-Z]|use[A-Z0-9])/
