import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { describe, expect, test } from "vitest"
import { rule } from "./rule-name-context"

void describe("rule-name-context", () => {
	const { valid, invalid } = createRuleTester({
		rule,
		languageOptions: { ecmaVersion: 6, parser: typescriptParser },
	})

	test("allows when displayName is already set", async () => {
		await valid(
			`
			const FooContext = createContext(null);
			FooContext.displayName = "FooContext"
			`
		)
	})

	test("allows non-context variables", async () => {
		await valid(
			`
			const NotAContext = somethingElse();
			`
		)
	})

	test("reports and fixes missing displayName for single context", async () => {
		const { result } = await invalid({
			code: `
				const FooContext = createContext(null);
			`,
			errors: ["name-context"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports only the context missing displayName when another is set", async () => {
		const { result } = await invalid({
			code: `
				const AContext = createContext(null);
				const BContext = createContext(null);
				BContext.displayName = "BContext";
			`,
			errors: ["name-context"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports both when multiple declarations in one statement are missing displayName", async () => {
		const { result } = await invalid({
			code: `
				let AContext = createContext(null), BContext = createContext(null);
			`,
			errors: ["name-context", "name-context"],
		})
		expect(result.output).toMatchSnapshot()
	})
})
