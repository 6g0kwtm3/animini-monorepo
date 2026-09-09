import type { ESLint } from "eslint"
import { rule as mustColocateFragmentSpreads } from "./rule-must-colocate-fragment-spreads"
import { rule as requireAliasOnFragmentSpread } from "./rule-require-alias-on-fragment-spread"
import { rule as unusedFields } from "./rule-unused-fields"
import { rule as requireThrowOnFieldErrorOnFragmentDefinition } from "./rule-require-throw-on-field-error-on-fragment-definition"
import { rule as requireRawResponseTypeOnOperationDefinition } from "./rule-require-raw-response-type-on-operation-definition"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-relay" },
	rules: {
		"unused-fields": unusedFields,
		"must-colocate-fragment-spreads": mustColocateFragmentSpreads,
		"require-alias-on-fragment-spread": requireAliasOnFragmentSpread,
		"require-throw-on-field-error-on-fragment-definition":
			requireThrowOnFieldErrorOnFragmentDefinition,
		"require-raw-response-type-on-operation-definition":
			requireRawResponseTypeOnOperationDefinition,
	},
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-relay/recommended",
			plugins: { "eslint-plugin-relay": plugin },
			rules: {
				"eslint-plugin-relay/unused-fields": "error",
				"eslint-plugin-relay/must-colocate-fragment-spreads": "error",
				"eslint-plugin-relay/require-alias-on-fragment-spread": "error",
				"eslint-plugin-relay/require-throw-on-field-error-on-fragment-definition":
					"error",
				"eslint-plugin-relay/require-raw-response-type-on-operation-definition":
					"error",
			},
		},
	},
} satisfies ESLint.Plugin
