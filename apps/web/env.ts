/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "react" {
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	interface CSSProperties {
		[key: `--${string}`]: string | number
	}
}

declare global {
	interface SetConstructor {
		new (): Set<never>
	}
	interface MapConstructor {
		new (): Map<never, never>
	}
}

export { }

