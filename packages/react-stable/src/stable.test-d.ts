import { it, assertType } from "vitest"
import { stable } from "./stable"
import type { Stable, DeepStable } from "./stable"

// `Stable<T>` is an interior operator on types: deflationary (law 1), monotone (law 2) and
// idempotent (law 3). Each law holds for every instantiation, but TypeScript can only check
// one when the outer application resolves, so the last law test pins where the checker stops.

it("law 1: Stable<T> is deflationary", () => {
	void function test<T>(value: Stable<T>) {
		assertType<T>(value)
	}
	void function testDeepStable<T>(value: DeepStable<T>) {
		assertType<T>(value)
	}
	void function testObject(value: Stable<{ a: number }>) {
		assertType<number>(value.a)
	}
	void function testFunction(value: Stable<(a: number) => string>) {
		assertType<string>(value(1))
	}
	void function testArray<T>(value: DeepStable<T[]>) {
		assertType<T[]>(value)
	}
})

it("law 1: an arbitrary value is not stable", () => {
	void function test<T>(value: T) {
		// @ts-expect-error TS2322 - An arbitrary value is not known to be stable.
		assertType<Stable<T>>(value)
	}
	void function testObject(value: { a: number }) {
		// @ts-expect-error TS2322 - A freshly created object is not stable.
		assertType<Stable<{ a: number }>>(value)
	}
	void function testFunction(value: () => void) {
		// @ts-expect-error TS2322 - A freshly created function is not stable.
		assertType<Stable<() => void>>(value)
	}
})

it("law 2: Stable<T> is monotone", () => {
	void function test(value: Stable<{ a: 1; b: 2 }>) {
		assertType<Stable<{ a: 1 }>>(value)
	}
	void function testDeepStable(value: DeepStable<{ a: 1; b: 2 }>) {
		assertType<DeepStable<{ a: 1 }>>(value)
	}
	void function testExtends<T extends { a: number }>(value: Stable<T>) {
		assertType<Stable<{ a: number }>>(value)
	}
	void function testWiden<T>(value: Stable<T>) {
		assertType<Stable<T | undefined>>(value)
	}
	void function testDeepStableWiden<T>(value: DeepStable<T>) {
		assertType<DeepStable<T | undefined>>(value)
	}
})

it("law 2: Stable<T> is not antitone", () => {
	void function test(value: Stable<{ a: 1 }>) {
		// @ts-expect-error TS2322 - Stability of the supertype says nothing about the subtype.
		assertType<Stable<{ a: 1; b: 2 }>>(value)
	}
	void function testNarrow<T>(value: Stable<T | undefined>) {
		// @ts-expect-error TS2322 - The undefined member has not been narrowed away.
		assertType<Stable<T>>(value)
	}
})

it("law 3: Stable<Stable<T>> is Stable<T>", () => {
	void function test<T>(value: Stable<Stable<T>>) {
		assertType<Stable<T>>(value)
	}
	void function testDeepStable<T>(value: DeepStable<DeepStable<T>>) {
		assertType<DeepStable<T>>(value)
	}
})

it("law 3: Stable<T> is idempotent for every kind of T", () => {
	// `Stable<T>` dispatches on the kind of `T`, so exhausting the kinds proves the law for
	// every `T`. Each call asserts both directions, i.e. that the two types are equivalent, and
	// names the kind it covers so that a failure reports which one stopped collapsing.
	type Idempotent<Applied, Twice> = [Applied, Twice] extends [Twice, Applied]
		? "idempotent"
		: "NOT idempotent: applying Stable twice changed the type"

	const stableOf = <T>(
		_verdict: Idempotent<Stable<T>, Stable<Stable<T>>>
	): void => {}
	const deepStableOf = <T>(
		_verdict: Idempotent<DeepStable<T>, DeepStable<DeepStable<T>>>
	): void => {}
	const deepStableOfStableOf = <T>(
		_verdict: Idempotent<DeepStable<T>, DeepStable<Stable<T>>>
	): void => {}

	stableOf<string>("idempotent")
	stableOf<42>("idempotent")
	stableOf<boolean>("idempotent")
	stableOf<symbol>("idempotent")
	stableOf<bigint>("idempotent")
	stableOf<null>("idempotent")
	stableOf<undefined>("idempotent")
	stableOf<unknown>("idempotent")
	stableOf<any>("idempotent")
	stableOf<never>("idempotent")
	stableOf<{ a: 1 }>("idempotent")
	stableOf<() => void>("idempotent")
	stableOf<[number, string]>("idempotent")
	stableOf<string[]>("idempotent")
	stableOf<{ a: 1 } | { b: 2 }>("idempotent")
	stableOf<{ a: 1 } | string | undefined>("idempotent")
	stableOf<{ a: { b: { c: 1 } } }>("idempotent")
	stableOf<{ a?: { b: 1 } }>("idempotent")
	stableOf<Record<string, { a: 1 }>>("idempotent")
	stableOf<Map<string, { a: 1 }>>("idempotent")

	deepStableOf<string>("idempotent")
	deepStableOf<42>("idempotent")
	deepStableOf<boolean>("idempotent")
	deepStableOf<symbol>("idempotent")
	deepStableOf<bigint>("idempotent")
	deepStableOf<null>("idempotent")
	deepStableOf<undefined>("idempotent")
	deepStableOf<unknown>("idempotent")
	deepStableOf<any>("idempotent")
	deepStableOf<never>("idempotent")
	deepStableOf<{ a: 1 }>("idempotent")
	deepStableOf<() => void>("idempotent")
	deepStableOf<[number, string]>("idempotent")
	deepStableOf<string[]>("idempotent")
	deepStableOf<{ a: 1 } | { b: 2 }>("idempotent")
	deepStableOf<{ a: 1 } | string | undefined>("idempotent")
	deepStableOf<{ a: { b: { c: 1 } } }>("idempotent")
	deepStableOf<{ a?: { b: 1 } }>("idempotent")
	deepStableOf<Record<string, { a: 1 }>>("idempotent")
	deepStableOf<Map<string, { a: 1 }>>("idempotent")

	deepStableOfStableOf<string>("idempotent")
	deepStableOfStableOf<unknown>("idempotent")
	deepStableOfStableOf<{ a: 1 }>("idempotent")
	deepStableOfStableOf<{ a: { b: { c: 1 } } }>("idempotent")
	deepStableOfStableOf<[number, string]>("idempotent")
	deepStableOfStableOf<{ a: 1 } | string | undefined>("idempotent")
})

it("laws 2 and 3 are not checkable against an unresolved type parameter", () => {
	// `Stable<T>` of a type parameter stays a deferred conditional type, and TypeScript never
	// substitutes the constraint of a conditional type in target position. Each case below is
	// sound and holds once `T` is instantiated, so the directives pin checker incompleteness
	// rather than a property of the type. Remove one if TypeScript ever reports it as unused.
	void function monotone<T extends U, U>(value: Stable<T>) {
		// @ts-expect-error TS2322 - `Stable<U>` cannot be resolved while `U` is a type parameter.
		assertType<Stable<U>>(value)
	}
	void function monotoneDeep<T extends U, U>(value: DeepStable<T>) {
		// @ts-expect-error TS2322 - `Stable<U>` cannot be resolved while `U` is a type parameter.
		assertType<DeepStable<U>>(value)
	}
	void function idempotent<T>(value: Stable<T>) {
		// @ts-expect-error TS2322 - `Stable<Stable<T>>` cannot be resolved while `T` is a type parameter.
		assertType<Stable<Stable<T>>>(value)
	}
	void function idempotentDeep<T>(value: DeepStable<T>) {
		// @ts-expect-error TS2322 - `Stable<Stable<T>>` cannot be resolved while `T` is a type parameter.
		assertType<DeepStable<DeepStable<T>>>(value)
	}
})

it("Stable<unknown> accepts primitives and stable references", () => {
	assertType<Stable<unknown>>("foo")
	assertType<Stable<unknown>>(1)
	assertType<Stable<unknown>>(true)
	assertType<Stable<unknown>>(null)
	assertType<Stable<unknown>>(undefined)
	assertType<Stable<unknown>>(stable({}))
	assertType<Stable<unknown>>(stable([]))
	// @ts-expect-error TS2345 - A plain object is not known to be stable.
	assertType<Stable<unknown>>({})
	// @ts-expect-error TS2345 - A plain array is not known to be stable.
	assertType<Stable<unknown>>([])
})

it("Stable<T> of a primitive is the primitive", () => {
	void function test(value: string) {
		assertType<Stable<string>>(value)
	}
	void function testNumber(value: 42) {
		assertType<DeepStable<number>>(value)
	}
})

it("Stable<T> of a union keeps its primitive members unmarked", () => {
	assertType<Stable<{ a: 1 } | string | undefined>>("foo")
	assertType<Stable<{ a: 1 } | string | undefined>>(undefined)
	assertType<Stable<{ a: 1 } | string | undefined>>(stable({ a: 1 as const }))
	// @ts-expect-error TS2345 - A freshly created object is not stable.
	assertType<Stable<{ a: 1 } | string | undefined>>({ a: 1 })
})

it("Stable<T | undefined> narrows to Stable<T>", () => {
	void function test<K extends string>(
		value: Stable<Record<K, number> | undefined>
	) {
		assertType<Stable<Record<K, number>> | undefined>(value)
	}
	void function testDeepStable<K extends string>(
		value: DeepStable<Record<K, number> | undefined>
	) {
		assertType<{ wrapped: DeepStable<Record<K, number>> } | undefined>(
			value && { wrapped: value }
		)
	}
})

it("DeepStable<T> is a subtype of Stable<T>", () => {
	void function test<T>(value: DeepStable<T>) {
		assertType<Stable<T>>(value)
	}
})

it("Stable<T> is not a subtype of DeepStable<T>", () => {
	void function test<T>(value: Stable<T>) {
		// @ts-expect-error TS2322 - Shallow stability does not imply deep stability.
		assertType<DeepStable<T>>(value)
	}
})

it("DeepStable<T> makes nested properties stable", () => {
	void function test<T>(value: DeepStable<{ foo: { bar: T } }>) {
		assertType<Stable<T>>(value.foo.bar)
	}
	void function testOptional<T>(value: DeepStable<{ foo?: { bar: T } }>) {
		assertType<Stable<T> | undefined>(value.foo?.bar)
	}
})

it("DeepStable<T> makes Map entries deep stable", () => {
	void function test<K, T>(value: DeepStable<Map<K, T>>) {
		assertType<Stable<Map<K, DeepStable<T>>>>(value)
	}
})

it("DeepStable<T> makes Set entries deep stable", () => {
	void function test<T>(value: DeepStable<Set<T>>) {
		assertType<Stable<Set<DeepStable<T>>>>(value)
	}
})

it("DeepStable<T> makes tuple elements stable", () => {
	void function test<T>(value: DeepStable<[T, T]>) {
		assertType<Stable<T>>(value[0])
	}
})
