import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { expect, test } from "vitest"
import { rule } from "./rule-require-alias-on-fragment-spread"
import { parser } from "@graphql-eslint/eslint-plugin"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: { parser, parserOptions: {} },
})

const graphql = String.raw

test("allows fragment spread with @alias directive", async () => {
	await valid(graphql`
		fragment foo on Page {
			...Component_fragment @alias
		}
	`)
})

test("allows multiple fragment spreads all with @alias", async () => {
	await valid(graphql`
		fragment foo on Page {
			...ComponentA_fragment @alias
			...ComponentB_fragment @alias
		}
	`)
})

test("allows fragment spread in query with @alias", async () => {
	await valid(graphql`
		query Root {
			...Component_fragment @alias
		}
	`)
})

test("allows fragment spreads in mutations without @alias", async () => {
	await valid(graphql`
		mutation {
			page_unlike(data: $input) {
				...Component_fragment
			}
		}
	`)
})

test("allows fragment spreads in subscriptions without @alias", async () => {
	await valid(graphql`
		subscription OnNewMessage {
			messageAdded {
				...Message_fragment
			}
		}
	`)
})

test("allows fragment spread with eslint-disable comment", async () => {
	await valid(graphql`
		fragment foo on Page {
			# eslint-disable-next-line rule-to-test/rule-to-test
			...Component_fragment
		}
	`)
})

test("reports error for fragment spread without @alias in fragment", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				...Component_fragment
			}
		`,
		errors: ["require-alias-on-fragment-spread"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page {
						...Component_fragment @alias
					}
				"
	`)
})

test("reports error for fragment spread without @alias in query", async () => {
	const { result } = await invalid({
		code: graphql`
			query Root {
				...Component_fragment
			}
		`,
		errors: ["require-alias-on-fragment-spread"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					query Root {
						...Component_fragment @alias
					}
				"
	`)
})

test("reports errors for multiple fragment spreads without @alias", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				...ComponentA_fragment
				...ComponentB_fragment
			}
		`,
		errors: [
			"require-alias-on-fragment-spread",
			"require-alias-on-fragment-spread",
		],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page {
						...ComponentA_fragment @alias
						...ComponentB_fragment @alias
					}
				"
	`)
})

test("reports error only for spread without @alias when mixed", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				...ComponentA_fragment @alias
				...ComponentB_fragment
			}
		`,
		errors: ["require-alias-on-fragment-spread"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page {
						...ComponentA_fragment @alias
						...ComponentB_fragment @alias
					}
				"
	`)
})

test("reports error for nested fragment spread without @alias", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				some_field {
					...Component_fragment
				}
			}
		`,
		errors: ["require-alias-on-fragment-spread"],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page {
						some_field {
							...Component_fragment @alias
						}
					}
				"
	`)
})

test("reports errors for two spreads without @alias where one is nested", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment foo on Page {
				...ComponentA_fragment
				nested {
					...ComponentA_fragment
				}
			}
		`,
		errors: [
			"require-alias-on-fragment-spread",
			"require-alias-on-fragment-spread",
		],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment foo on Page {
						...ComponentA_fragment @alias
						nested {
							...ComponentA_fragment @alias
						}
					}
				"
	`)
})

test("reports errors for nested fragment spreads where outer has @alias but inner does not", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment Foo on Page {
				...Foo @alias
				nested {
					...Foo
				}
			}
		`,
		errors: ["require-alias-on-fragment-spread"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment Foo on Page {
						...Foo @alias
						nested {
							...Foo @alias
						}
					}
				"
	`)
})

test("allows nested fragment spreads both with @alias", async () => {
	await valid(graphql`
		fragment Foo on Page {
			...Foo @alias
			nested {
				...Foo @alias
			}
		}
	`)
})
