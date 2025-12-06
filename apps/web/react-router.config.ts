import type { Config } from "@react-router/dev/config"

export default {
	future: {
		unstable_optimizeDeps: true,
		v8_splitRouteModules: true,
		v8_viteEnvironmentApi: true,
		v8_middleware: true,
		unstable_subResourceIntegrity: true,
	},
	ssr: false,
	buildDirectory: "dist",
} satisfies Config
