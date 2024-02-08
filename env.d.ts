/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

export {}
