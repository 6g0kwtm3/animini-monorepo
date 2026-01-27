import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { describe } from "vitest"
import { expect, test } from "vitest"
import { rule } from "./rule-static-css-namespace.ts"

void describe("rule-static-css-namespace", () => {
	const { valid, invalid } = createRuleTester({
		rule,
		languageOptions: {
			ecmaVersion: 6,
			parser: typescriptParser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
	})

	test("allow static", async () => {
		await valid(
			`
			<Box $style={({
        display: "flex",
      })} />
			`
		)
	})

	test("allow static function", async () => {
		await valid(
			`
			<Box $style={$precompileStyles({
        display: "flex",
      })} />
			`
		)
	})

	test("allow static member", async () => {
		await valid(
			`
      <Box $style={$design.style} />
			`
		)
	})

	test("allow static props", async () => {
		await valid(
			`
      function Component(props) {
        return <Box $style={props.$style} />
      }
			`
		)
	})

	test("allow nested static props", async () => {
		await valid(
			`
      function Component(props) {
        return <Box $style={props.$slot.style} />
      }
			`
		)
	})

	test("disallow non static function", async () => {
		const { result } = await invalid({
			code: `
			<Box $style={precompileStyles({
        display: "flex",
      })} />
			`,
		})
		expect(result.output).toMatchSnapshot()
	})

	test("disallow non static props", async () => {
		const { result } = await invalid({
			code: `
      function Component(props) {
        return <Box $style={props.style} />
      }
			`,
		})
		expect(result.output).toMatchSnapshot()
	})

	test("disallow nested static props", async () => {
		const { result } = await invalid({
			code: `
      function Component(props) {
        return <Box $style={props.slot.$style} />
      }
			`,
		})
		expect(result.output).toMatchSnapshot()
	})
})
