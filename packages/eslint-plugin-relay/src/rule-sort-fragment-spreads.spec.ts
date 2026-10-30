import { parser } from "@graphql-eslint/eslint-plugin"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { expect, test } from "vitest"

import { rule } from "./rule-sort-fragment-spreads"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: { parser, parserOptions: {} },
})

const graphql = String.raw

test("allows selection set without fragment spreads", async () => {
	await valid(graphql`
		query {
			name
			age
		}
	`)
})

test("allows selection set with fragment spread at the end", async () => {
	await valid(graphql`
		query {
			name
			age
			...UserFragment
		}
	`)
})

test("allows selection set with multiple fragment spreads at the end", async () => {
	await valid(graphql`
		query {
			name
			age
			...UserFragment
			...ProfileFragment
		}
	`)
})

test("allows selection set containing only fragment spreads", async () => {
	await valid(graphql`
		query {
			...UserFragment
			...ProfileFragment
		}
	`)
})

test("reports fragment spread before field selection", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...UserFragment
				name
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						name
						...UserFragment
					}
				"
	`)
})

test("reports fragment spreads interspersed with field selections", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...UserFragment
				name
				...ProfileFragment
				age
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						name
						age
						...UserFragment
						...ProfileFragment
					}
				"
	`)
})

test("reports multiple fragment spreads before field selections", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...UserFragment
				...ProfileFragment
				name
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						name
						...UserFragment
						...ProfileFragment
					}
				"
	`)
})

test("reports fragment spreads before inline fragments", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...UserFragment
				... on User {
					name
				}
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						... on User {
							name
						}
						...UserFragment
					}
				"
	`)
})

test("sorts fragment spreads independently in nested selection sets", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...UserFragment
				user {
					...ProfileFragment
					name
				}
			}
		`,
		errors: ["sort", "sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						user {
							name
							...ProfileFragment
						}
						...UserFragment
					}
				"
	`)
})

test("does not report already sorted nested selection sets", async () => {
	await valid(graphql`
		query {
			user {
				name
				...ProfileFragment
			}
			...UserFragment
		}
	`)
})

test("preserves the relative order of fragment spreads", async () => {
	const { result } = await invalid({
		code: graphql`
			query {
				...FirstFragment
				name
				...SecondFragment
				age
				...ThirdFragment
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					query {
						name
						age
						...FirstFragment
						...SecondFragment
						...ThirdFragment
					}
				"
	`)
})

test("sorts fragment spreads in fragment definitions", async () => {
	const { result } = await invalid({
		code: graphql`
			fragment UserFragment on User {
				...ProfileFragment
				name
				...AddressFragment
			}
		`,
		errors: ["sort"],
	})

	expect(result.output).toMatchInlineSnapshot(`
		"
					fragment UserFragment on User {
						name
						...ProfileFragment
						...AddressFragment
					}
				"
	`)
})

test("allows fragment spreads at the end of inline fragment selection sets", async () => {
	await valid(graphql`
		query {
			... on User {
				name
				...ProfileFragment
			}
		}
	`)
})
