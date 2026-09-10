declare const stableBrand: unique symbol

type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined
	| void

type StableBrand = { readonly [stableBrand]: true }

type StableMark = StableBrand | Primitive

type StableMarkFor<T> = unknown extends T ? StableMark : StableBrand
type DeepStableMark<T> = T extends readonly unknown[]
	? number extends T["length"]
		? unknown
		: T extends readonly [...infer E]
			? { readonly [K in keyof E]: DeepStable<E[K]> }
			: unknown
	: T extends Map<infer K, infer V>
		? Map<K, DeepStable<V>>
		: T extends ReadonlyMap<infer K, infer V>
			? ReadonlyMap<K, DeepStable<V>>
			: T extends Set<infer V>
				? Set<DeepStable<V>>
				: T extends ReadonlySet<infer V>
					? ReadonlySet<DeepStable<V>>
					: T extends WeakMap<infer K, infer V>
						? WeakMap<K, DeepStable<V>>
						: T extends WeakSet<infer V>
							? WeakSet<DeepStable<V>>
							: T extends Promise<infer V>
								? Promise<DeepStable<V>>
								: T extends object
									? { readonly [K in keyof T]: DeepStable<T[K]> }
									: unknown

export type Stable<T> = T extends Primitive ? T : T & StableMarkFor<T>

export type DeepStable<T> = T extends Primitive
	? T
	: T & StableMarkFor<T> & DeepStableMark<T>
export function stable<T extends object>(value: T): Stable<T> {
	return value as Stable<T>
}
export type StableProps<T> = {
	[K in keyof T]: Stable<T[K]>
}
