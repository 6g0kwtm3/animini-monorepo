import { unstable_vitePlugin as remix } from "@remix-run/dev"
import million from "million/compiler"
import { defineConfig } from "vite"
import { cjsInterop } from "vite-plugin-cjs-interop"
import relay from "vite-plugin-relay"
import tsconfigPaths from "vite-tsconfig-paths"
import config from "./remix.config"

export default defineConfig({
	plugins: [
		million.vite({ auto: true, mute: true }),
		remix(config),
		tsconfigPaths(),
		relay,
		cjsInterop({
			dependencies: ["react-relay"],
		}),
	],
	ssr: {
		noExternal: ["rescript-relay"],
	},
	server: {
		port: 3000,
	},
	define: {
		"process.env.NODE_DEBUG": false,
	},
})
