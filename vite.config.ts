import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { tvTransformer } from "tailwind-variants/transformer"
import icons from "unplugin-icons/vite"
import { defineConfig, type PluginOption } from "vite"
import babel from "vite-plugin-babel"
import Inspect from "vite-plugin-inspect"
import oxlintPlugin from "vite-plugin-oxlint"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindConfig from "./tailwind.config"

const isStorybook = process.argv[1]?.includes("storybook")
const isVitest = process.argv[1]?.includes("vitest")
const isBun = (): boolean => !!globalThis.Bun

export default defineConfig({
	plugins: [
		Inspect(),
		oxlintPlugin(),
		// eslintPlugin(),
		tvTransform(),
		tailwindcss(),

		// !isStorybook &&
		// 	!isVitest &&
		babel({
			filter: /\.[jt]sx?$/,
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [["babel-plugin-react-compiler", {}]],
			},
			include: [
				"app/routes/**/*.tsx",
				"app/components/**/*.tsx",
				"app/lib/**/*.tsx",
			],
		}),
		isBun()
			? null
			: paraglide({
					project: "./project.inlang",
					outdir: "./app/paraglide",
				}),

		// remixDevTools(),
		// cloudflareDevProxy(),

		!isStorybook && !isVitest && reactRouter(),
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
	},
	optimizeDeps: {
		include: ["relay-runtime", "react-relay"],
	},
})

function tvTransform(): PluginOption {
	return {
		enforce: "pre",
		name: "tv-transformer",
		transform(src, id) {
			if (/\.[jt]sx?$/.test(id)) {
				return {
					code: tvTransformer(src, Object.keys(tailwindConfig.theme.screens)),
					map: null,
				}
			}
		},
	}
}
