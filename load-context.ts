import { type PlatformProxy } from "wrangler"

type Cloudflare = Omit<PlatformProxy<globalThis.Env>, "dispose">

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare
	}
}
