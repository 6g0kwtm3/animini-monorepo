import type { Config } from "@react-router/dev/config"
import { sentryOnBuildEnd } from "@sentry/react/vite"

export default {
	future: { unstable_optimizeDeps: true },
	splitRouteModules: true,
	subResourceIntegrity: true,
	ssr: false,
	buildDirectory: "dist",
	buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
		// ...
		// Call this at the end of the hook
		await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest })
	},
} satisfies Config
