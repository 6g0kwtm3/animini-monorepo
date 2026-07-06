/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "react" {
	// oxlint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	interface CSSProperties {
		[key: `--${string}`]: number | string
	}
}

export {}
