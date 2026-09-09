import { createRuleTester } from "eslint-vitest-rule-tester"
import { expect, test } from "vitest"
import { rule } from "./rule-require-throw-on-field-error-on-fragment-definition"
import { parser } from "@graphql-eslint/eslint-plugin"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: { parser, parserOptions: {} },
})

const graphql = String.raw

test("allows fragment definition with @throwOnFieldError directive", async () => {
	await valid(graphql`
		fragment foo on Page @throwOnFieldError {
			name
		}
	`)
})

test("allows fragment definition with @throwOnFieldError among other directives", async () => {
	await valid(graphql`
		fragment foo on Page @relay(plural: true) @throwOnFieldError {
			name
		}
	`)
})

test("allows fragment definition with @assignable", async () => {
	await valid(graphql`
		fragment foo on Page @assignable {
			name
		}
	`)
})

test("allows fragment definition with @updatable", async () => {
	await valid(graphql`
		fragment foo on Page @updatable {
			name
		}
	`)
})

test("reports fragment definition missing @throwOnFieldError", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				name
			}
		`,
		errors: ["require-throw-on-field-error-on-fragment-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page @throwOnFieldError {
						name
					}
				"
	`)
})

test("reports fragment definition missing @throwOnFieldError with directive", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page @directive {
				name
			}
		`,
		errors: ["require-throw-on-field-error-on-fragment-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page @throwOnFieldError @directive {
						name
					}
				"
	`)
})

test("reports multiple fragment definitions missing @throwOnFieldError", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				name
			}
			fragment bar on Page {
				name
			}
		`,
		errors: [
			"require-throw-on-field-error-on-fragment-definition",
			"require-throw-on-field-error-on-fragment-definition",
		],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page @throwOnFieldError {
						name
					}
					fragment bar on Page @throwOnFieldError {
						name
					}
				"
	`)
})

test("reports only the fragment definition missing @throwOnFieldError when mixed", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				name
			}
			fragment bar on Page @throwOnFieldError {
				name
			}
		`,
		errors: ["require-throw-on-field-error-on-fragment-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page @throwOnFieldError {
						name
					}
					fragment bar on Page @throwOnFieldError {
						name
					}
				"
	`)
})
