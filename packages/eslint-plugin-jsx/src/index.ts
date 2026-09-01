import type { ESLint, Rule } from "eslint"
import { rule as noUnusedReturnValues } from "./no-unused-return-values"
import { rule as mustIncludeDataKey } from "./rule-must-include-data-key"
import { rule as nameContext } from "./rule-name-context"
import { rule as noUnsoundArrayCovariance } from "./rule-no-unsound-array-covariance"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-jsx" },
	rules: {
		"rule-must-include-data-key":
			mustIncludeDataKey as unknown as Rule.RuleModule,
		"name-context": nameContext,
		"no-unused-return-values":
			noUnusedReturnValues as unknown as Rule.RuleModule,
		"no-unsound-array-covariance":
			noUnsoundArrayCovariance as unknown as Rule.RuleModule,
	},
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-jsx/recommended",
			plugins: { "eslint-plugin-jsx": plugin },
			rules: {
				"eslint-plugin-jsx/rule-must-include-data-key": "error",
				"eslint-plugin-jsx/name-context": "error",
				"eslint-plugin-jsx/no-unused-return-values": "error",
				"eslint-plugin-jsx/no-unsound-array-covariance": "warn",
			},
		},
	},
} satisfies ESLint.Plugin
