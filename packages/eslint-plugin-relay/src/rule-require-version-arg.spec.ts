import { parser } from "@graphql-eslint/eslint-plugin"
import { createRuleTester } from "eslint-vitest-rule-tester"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "vitest"

import { rule } from "./rule-require-version-arg"

const here = path.dirname(fileURLToPath(import.meta.url))
const fixtureSchema = path.resolve(here, "./fixtures/schema.graphql")

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: {
		parser,
		parserOptions: { graphQLConfig: { schema: fixtureSchema } },
	},
})

test("reports a missing optional version argument", async () => {
	await invalid({
		code: /* GraphQL */ `
			query Root {
				media {
					status
				}
			}
		`,
		errors: [
			{
				messageId: "missingVersionArg",
				data: {
					field: "status",
					argument: "version",
					expectation:
						'Schema doc: "Provide 2 to use new version 2 of sources enum".',
				},
			},
		],
	})
})

test("reports source without a version argument", async () => {
	await invalid({
		code: /* GraphQL */ `
			query Root {
				media {
					source
				}
			}
		`,
		errors: [
			{
				messageId: "missingVersionArg",
				data: {
					field: "source",
					argument: "version",
					expectation:
						'Schema doc: "Provide 2 or 3 to use new version 2 or 3 of sources enum".',
				},
			},
		],
	})
})

test("reports relationType without a version argument", async () => {
	await invalid({
		code: /* GraphQL */ `
			query Root {
				media {
					relationType
				}
			}
		`,
		errors: [
			{
				messageId: "missingVersionArg",
				data: {
					field: "relationType",
					argument: "version",
					expectation:
						'Schema doc: "Provide 3 to use new version 3 of relation enum".',
				},
			},
		],
	})
})

test("stays clean when the argument is passed", async () => {
	await valid(/* GraphQL */ `
		query Root {
			media {
				status(version: 2)
			}
		}
	`)
})

test("stays clean for an optional argument whose name does not end in version", async () => {
	await valid(/* GraphQL */ `
		query Root {
			report {
				pageable
			}
		}
	`)
})

test("never flags a required version argument", async () => {
	await valid(/* GraphQL */ `
		query Root {
			report {
				requiredVersion
			}
		}
	`)
})

test("stays quiet for a field whose definition cannot be found", async () => {
	await valid(/* GraphQL */ `
		query Root {
			media {
				notInSchema(version: 2)
			}
		}
	`)
})

test("does not crash on a document with a syntax error", async () => {
	await invalid({
		code: /* GraphQL */ `
			query Root {
				media {
			}
		`,
		// The preexisting parser error is the only report — the rule itself never crashes.
		errors: (messages) => {
			expect(messages).toHaveLength(1)
			const [message] = messages
			expect(message?.fatal).toBe(true)
			expect(message?.message).toMatch(/Syntax Error/)
		},
	})
})

test("stays clean for a top-level document with no fields", async () => {
	await valid(/* GraphQL */ `
		query Root {}
	`)
})

test("treats an aliased field as the field's own arguments", async () => {
	await invalid({
		code: /* GraphQL */ `
			query Root {
				media {
					alias: status
				}
			}
		`,
		errors: [
			{
				messageId: "missingVersionArg",
				data: {
					field: "status",
					argument: "version",
					expectation:
						'Schema doc: "Provide 2 to use new version 2 of sources enum".',
				},
			},
		],
	})

	await valid(/* GraphQL */ `
		query Root {
			media {
				alias: status(version: 2)
			}
		}
	`)
})

test("accepts the eslint-disable-next-line escape hatch", async () => {
	await valid(/* GraphQL */ `
		query Root {
			media {
				# eslint-disable-next-line rule-to-test/rule-to-test
				status
			}
		}
	`)
})
