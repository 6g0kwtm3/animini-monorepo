/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "react" {
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

declare global {
	type SetConstructor = new () => Set<never>
	type MapConstructor = new () => Map<never, never>
}

export {}

declare module "relay-runtime" {
	export const readFragment: typeof import("react-relay").readInlineData
}
