/// <reference types="@vercel/remix" />
/// <reference types="vite/client" />

declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

export { }

