import { plugin as jsxPlugin } from "@anitrove/eslint-plugin-jsx"
import { plugin as relayPlugin } from "@anitrove/eslint-plugin-relay"
import { rule as staticCssNamespaceRule } from "./rule-static-css-namespace.ts"
import { definePlugin } from "oxlint"

const plugin = definePlugin({
	meta: { name: "@anitrove/eslint-plugin" },
	rules: {
		...jsxPlugin.rules,
		...relayPlugin.rules,
		"rule-static-css-namespace": staticCssNamespaceRule,
	},
})

export default plugin
