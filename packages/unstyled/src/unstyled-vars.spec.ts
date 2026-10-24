import { expect, it } from "vitest"

import { createVar, provide } from "./unstyled-vars.ts"

const size = createVar("--size", ["xs", "sm"])

it("points the base variable at the provided variant", () => {
	expect(provide(size, "sm").dynamicVars).toEqual({
		"--size": "var(--size-sm)",
	})
})

it("declares every variant through the base variable without a fallback", () => {
	const { preCompiledStyles } = provide(size, "sm")

	expect(Object.keys(preCompiledStyles)).toEqual(["--size-xs", "--size-sm"])
	expect(preCompiledStyles["--size-xs"]).toMatch(/--size-xs:\s*var\(--size,\);/)
	expect(preCompiledStyles["--size-sm"]).toMatch(/--size-sm:\s*var\(--size,\);/)
})

it("stringifies boolean variants", () => {
	const first = createVar("--first", [true, false])

	expect(provide(first, true).dynamicVars).toEqual({
		"--first": "var(--first-true)",
	})
	expect(provide(first, false).dynamicVars).toEqual({
		"--first": "var(--first-false)",
	})
})

it("stringifies numeric variants", () => {
	const level = createVar("--level", [1, 2])

	expect(provide(level, 2).dynamicVars).toEqual({
		"--level": "var(--level-2)",
	})
})
