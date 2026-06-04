import type { Config } from "@react-router/dev/config"

export default {
	future: { unstable_optimizeDeps: true },
	splitRouteModules: true,
	subResourceIntegrity: true,
	ssr: false,
	buildDirectory: "dist",
} satisfies Config
