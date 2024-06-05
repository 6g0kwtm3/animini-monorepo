import type {
	TypedDeferredData,
	TypedResponse
} from "@remix-run/cloudflare"
import { useLoaderData, useRouteLoaderData } from "@remix-run/react"

export const useRawLoaderData = useLoaderData

export const useRawRouteLoaderData = useRouteLoaderData

export type SerializeFrom<T> = T extends (...args: any[]) => infer Output
	? Serialize<Awaited<Output>>
	: Jsonify<Awaited<T>>

type Serialize<Output> =
	Output extends TypedDeferredData<infer U>
		? {
				[K in keyof U as K extends symbol
					? never
					: Promise<any> extends U[K]
						? K
						: never]: DeferValue<U[K]>
			} & Jsonify<{
				[K in keyof U as Promise<any> extends U[K] ? never : K]: U[K]
			}>
		: Output extends TypedResponse<infer U>
			? Jsonify<U>
			: Jsonify<Output>

type DeferValue<T> = T extends undefined
	? undefined
	: T extends Promise<unknown>
		? Promise<Jsonify<Awaited<T>>>
		: Jsonify<T>

export type Jsonify<T> = T
