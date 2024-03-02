import { useLoaderData, useRouteLoaderData } from "@remix-run/react"
import type { TypedDeferredData, TypedResponse } from "@vercel/remix"

export function useRawLoaderData<T>(): SerializeFrom<T> {
	return useLoaderData() as SerializeFrom<T>
}

export function useRawRouteLoaderData<T>(
	...args: Parameters<typeof useRouteLoaderData>
): SerializeFrom<T> | undefined {
	return useRouteLoaderData(...args) as SerializeFrom<T> | undefined
}

type SerializeFrom<T> = T extends (...args: any[]) => infer Output
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
