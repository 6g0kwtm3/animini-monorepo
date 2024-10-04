import { paraglide } from "@inlang/paraglide-vite"
import MillionLint from "@million/lint"
import { reactRouter as remix } from "@react-router/dev/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"
const isStorybook = process.argv[1]?.includes("storybook")
const isVitest = process.argv[1]?.includes("vitest")
const isBun = (): boolean => !!globalThis.Bun

const ReactCompilerConfig = {}
export default defineConfig({
	plugins: [
		Inspect(),
		// babel({
		// 	filter: /\.[jt]sx?$/,
		// 	include: [
		// 		"app/routes/_nav.user.$userName/*.tsx",
		// 		"app/routes/_nav.user.$userName.$typelist/*.tsx",
		// 		"app/components/**/*.tsx",
		// 		"app/lib/**/*.tsx",
		// 	],
		// 	babelConfig: {
		// 		presets: ["@babel/preset-typescript"], // if you use TypeScript
		// 		plugins: [
		// 			// ["@babel/plugin-syntax-jsx"],
		// 			["babel-plugin-react-compiler", ReactCompilerConfig],
		// 		],
		// 	},
		// }),

		!isStorybook &&
			!isVitest &&
			MillionLint.vite({
				babel: {
					plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
				},
				lite: true,
				filter: {
					include: [
						"app/routes/**/*.tsx",
						"app/components/**/*.tsx",
						"app/lib/**/*.tsx",
					],
				},
			}),
		isBun()
			? null
			: paraglide({
					project: "./project.inlang",
					outdir: "./app/paraglide",
				}),

		// remixDevTools(),
		// cloudflareDevProxy(),

		!isStorybook &&
			!isVitest &&
			remix({
				future: {},
				ssr: false,
				prerender: true,
			}),
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
