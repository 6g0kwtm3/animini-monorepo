/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "react" {
	type CSSProperties = Record<`--${string}`, string | number>
}

export {}
