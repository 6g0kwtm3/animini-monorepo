import type { Config } from "@react-router/dev/config"
import type { PlatformProxy } from "wrangler"

export default {
	future: {
		unstable_optimizeDeps: true,
	},
	ssr: true,
} satisfies Config

declare module "react-router" {
	interface AppLoadContext {
		cloudflare: Omit<PlatformProxy<Env>, "dispose">
	}
}
