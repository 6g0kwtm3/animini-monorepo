import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { rule } from "./no-unused-return-values"

void describe("no-unused-return-values", () => {
	const { valid, invalid } = createRuleTester({
		rule,
		languageOptions: {
			ecmaVersion: 6,
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				projectService: { allowDefaultProject: ["*.ts*"] },
				tsconfigRootDir: path.join(import.meta.dirname, "..", ".."),
			},
		},
	})

	test("allows return void", async () => {
		await valid(
			`
      declare function foo(): void;
			foo();
			`
		)
	})

	test("allows inferred void", async () => {
		await valid(
			`
      function foo() {}
			foo();
			`
		)
	})

	test("reports error for unused return values", async () => {
		const { result } = await invalid({
			code: `
      declare function foo(): number;
			foo();
        `,
			errors: ["return-value-not-used"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("allows used return values", async () => {
		await valid(
			`
      declare function foo(): number;
			const value = foo();
        `
		)
	})

	test("allows optional chaining", async () => {
		await valid(
			`
      declare const bar: null | {
        foo(): number
      }
			bar?.foo();
      `
		)
	})
})
