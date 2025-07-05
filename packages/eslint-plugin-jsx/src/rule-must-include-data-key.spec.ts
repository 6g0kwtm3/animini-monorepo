import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { describe } from "node:test"
import { expect, test } from "vitest"
import { rule } from "./rule-must-include-data-key"

void describe("rule-must-include-data-key", () => {
	const { valid, invalid } = createRuleTester({
		rule,
		languageOptions: {
			ecmaVersion: 6,
			parser: typescriptParser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
	})

	test("allows equal key and data-key", async () => {
		await valid(
			`
			<li key="foo" data-key="foo" />
			`
		)
	})

	test("allows equal key and data-key with boolean value", async () => {
		await valid(
			`
			<li key data-key />
			`
		)
	})

	test("allows equal key and data-key with computed value", async () => {
		await valid(
			`
      <li key={foo + bar} data-key={foo + bar} />
      `
		)
	})

	test("ignores whitespace", async () => {
		await valid(
			`
      <li key={foo + bar} data-key={foo +\nbar} />
      `
		)
	})

	test("substitutes vars", async () => {
		await valid(
			`
			const bar = "bar";
      <li key="bar" data-key={bar} />
      `
		)
	})

	test("allows empty key and data-key", async () => {
		await valid(
			`
      <li />
      `
		)
	})

	test("reports error for missing data-key", async () => {
		const { result } = await invalid({
			code: `
        <li key="foo" />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for missing data-key with boolean value", async () => {
		const { result } = await invalid({
			code: `
        <li key data-key="foo" />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for different data-key", async () => {
		const { result } = await invalid({
			code: `
        <li key={foo + bar} />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for different data-key with computed value", async () => {
		const { result } = await invalid({
			code: `
				<li key="foo" data-key={foo} />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error when data-key is a boolean attribute without value", async () => {
		const { result } = await invalid({
			code: `
				<li key="foo" data-key />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for missing data-key with computed value", async () => {
		const { result } = await invalid({
			code: `
        <li key={foo + bar} data-key="foo" />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for different data-key with computed value", async () => {
		const { result } = await invalid({
			code: `
        <li key={foo + bar} data-key={foo} />
        `,
			errors: ["data-key-must-match-key"],
		})
		expect(result.output).toMatchSnapshot()
	})
})
