import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"
import { unstable_reactRouterRSC as reactRouter } from "@react-router/dev/vite"
import { sentryVitePlugin as sentry } from "@sentry/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import inspect from "vite-plugin-inspect"
import relay from "vite-plugin-relay"
import react from "@vitejs/plugin-react"
import rsc from "@vitejs/plugin-rsc"

const relayRuntimeTypeOnlyImports = {
	name: "relay-runtime-type-only-imports",
	enforce: "pre" as const,
	transform(code: string, id: string) {
		if (!id.endsWith(".graphql.ts")) return null
		const next = code.replace(
			/^import \{([^}]+)\} from (['"])relay-runtime\2/gm,
			"import type {$1} from $2relay-runtime$2"
		)
		return next === code ? null : { code: next, map: null }
	},
}

export default defineConfig({
	plugins: [
		relayRuntimeTypeOnlyImports,
		inspect(),
		tailwindcss(),
		babel({
			filter: /\.[jt]sx?$/,
			include: ["./app/**/*.tsx"],
			exclude: [/~icons/],
		}),
		paraglide({ project: "./project.inlang", outdir: "./app/paraglide" }),

		reactRouter(),
		react(),
		rsc(),
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
			reactComponentAnnotation: { enabled: true },
		}),
	],
	preview: { port: 3000 },
	server: { port: 3000 },
	build: { sourcemap: true },
	resolve: { tsconfigPaths: true },
	envPrefix: ["VITE_", "CF_", "NODE_"],
	environments: {
		client: { optimizeDeps: { include: ["react-relay", "relay-runtime"] } },
		ssr: { optimizeDeps: { include: ["react-relay", "relay-runtime"] } },
		rsc: { optimizeDeps: { include: ["react-relay", "relay-runtime"] } },
	},
})
