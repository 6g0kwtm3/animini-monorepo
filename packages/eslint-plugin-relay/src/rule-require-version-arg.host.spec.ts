import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { test } from "vitest"

import { rule } from "./rule-require-version-arg"

const { valid } = createRuleTester({
	rule,
	languageOptions: {
		parser: typescriptParser,
		parserOptions: { ecmaVersion: 2020, sourceType: "module", ecmaFeatures: { jsx: true } },
	},
})

test("does not fire on an inline graphql tag in a .tsx host file", async () => {
	await valid(`
import ReactRelay from "react-relay"
import { graphql } from "react-relay"

const fragment = graphql\`
	fragment Test on Media @throwOnFieldError {
		status
	}
\`

export const X = fragment
`)
})
