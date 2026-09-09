import { createRuleTester } from "eslint-vitest-rule-tester"
import { expect, test } from "vitest"
import { rule } from "./rule-require-raw-response-type-on-operation-definition"
import { parser } from "@graphql-eslint/eslint-plugin"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: { parser, parserOptions: {} },
})

const graphql = String.raw

test("allows query with @raw_response_type", async () => {
	await valid(graphql`
		query Foo @raw_response_type {
			name
		}
	`)
})

test("allows mutation with @raw_response_type", async () => {
	await valid(graphql`
		mutation Foo @raw_response_type {
			name
		}
	`)
})

test("allows subscription with @raw_response_type", async () => {
	await valid(graphql`
		subscription Foo @raw_response_type {
			name
		}
	`)
})

test("allows operation with @raw_response_type among other directives", async () => {
	await valid(graphql`
		query Foo @relay @raw_response_type {
			name
		}
	`)
})

test("allows anonymous operation (no name)", async () => {
	await valid(graphql`
		query {
			name
		}
	`)
})

test("reports query missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			query Foo {
				name
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Foo @raw_response_type {
						name
					}
				"
	`)
})

test("reports mutation missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			mutation Foo {
				name
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					mutation Foo @raw_response_type {
						name
					}
				"
	`)
})

test("reports subscription missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			subscription Foo {
				name
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					subscription Foo @raw_response_type {
						name
					}
				"
	`)
})

test("reports query with variables missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			query Foo($id: ID!) {
				node(id: $id) {
					name
				}
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Foo($id: ID!) @raw_response_type {
						node(id: $id) {
							name
						}
					}
				"
	`)
})

test("reports query with existing directive missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			query Foo @relay {
				name
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Foo @relay @raw_response_type {
						name
					}
				"
	`)
})

test("reports multiple operations missing @raw_response_type", async () => {
	const { result } = await invalid({
		code: graphql`
			query Foo {
				name
			}
			mutation Bar {
				name
			}
		`,
		errors: [
			"require-raw-response-type-on-operation-definition",
			"require-raw-response-type-on-operation-definition",
		],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Foo @raw_response_type {
						name
					}
					mutation Bar @raw_response_type {
						name
					}
				"
	`)
})

test("reports only operation missing @raw_response_type when mixed", async () => {
	const { result } = await invalid({
		code: graphql`
			query Foo @raw_response_type {
				name
			}
			mutation Bar {
				name
			}
		`,
		errors: ["require-raw-response-type-on-operation-definition"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Foo @raw_response_type {
						name
					}
					mutation Bar @raw_response_type {
						name
					}
				"
	`)
})
