/// <reference types="vite/client" />

declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: number | string
	}
}

export {}
