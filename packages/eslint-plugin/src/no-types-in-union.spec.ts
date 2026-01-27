import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { describe, expect, test } from "vitest"
import { noTypesInUnion } from "./no-types-in-union.ts"

void describe("rule-no-types-in-union", () => {
	const { valid, invalid } = createRuleTester({
		rule: noTypesInUnion,
		languageOptions: {
			ecmaVersion: 6,
			parser: typescriptParser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
	})

	test("reports error for null", async () => {
		const { result } = await invalid({
			code: `
			type Foo = "foo" | null;
			`,
			errors: ["no-type-in-union"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for undefined", async () => {
		const { result } = await invalid({
			code: `
			type Foo = "foo" | undefined;
			`,
			errors: ["no-type-in-union"],
		})
		expect(result.output).toMatchSnapshot()
	})

  test("reports error for array", async () => {
		const { result } = await invalid({
			code: `
			type Foo = "Foo"[];
			`,
			errors: ["no-type-in-union"],
		})
		expect(result.output).toMatchSnapshot()
	})
})
