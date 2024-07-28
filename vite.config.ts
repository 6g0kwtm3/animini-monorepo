import { paraglide } from "@inlang/paraglide-vite"
import MillionLint from "@million/lint"

import { vitePlugin as remix } from "@remix-run/dev"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"
const isStorybook = process.argv[1]?.includes("storybook")

export default defineConfig({
	plugins: [
		// MillionLint.vite({
		// 	optimizeDOM: true,
		// }),
		globalThis.Bun || paraglide({
			project: "./project.inlang",
			outdir: "./app/paraglide",
		}),

		// remixDevTools(),
		// cloudflareDevProxy(),

		!isStorybook &&
			remix({
				future: {
					v3_fetcherPersist: true,
					v3_relativeSplatPath: true,
					v3_throwAbortReason: true,
					unstable_singleFetch: true,
				},
				ssr: false,

				// routes(defineRoutes) {
				// 	return defineRoutes((route) => {
				// 		// route("", "routes/Nav.tsx", () => {
				// 		// 	// route("", "routes/NavFeed.tsx", { index: true })
				// 		// 	route("user/:userName", "routes/NavUser.tsx", { index: true })
				// 		// 	route("login", "routes/NavLogin.tsx")
				// 		// 	route("user/:userName/:typelist", "routes/NavUserList.tsx", () => {
				// 		// 		route(":selected?", "routes/NavUserListEntries.tsx")
				// 		// 	})
				// 		// })
				// 	})
				// }
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
