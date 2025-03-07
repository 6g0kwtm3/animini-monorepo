/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

export {}
