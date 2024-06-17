/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

declare module "relay-runtime" {
	export const suspenseSentinel: <T>() => T
}

export { }

