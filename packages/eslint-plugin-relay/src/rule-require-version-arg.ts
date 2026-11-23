import type { GraphQLESLintRule, GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin"
import type { FieldNode } from "graphql"

const NON_NULL_TAG = "GraphQLNonNull"

/**
 * Structural check that the parser wired a usable schema. The schema is never
 * imported from this rule's module graph — it comes from the parser's own
 * graphQLConfig wiring, so a realm-sensitive `instanceof` check would throw.
 */
function isGraphQLSchema(value: unknown): boolean {
	if (typeof value !== "object" || value === null) return false
	const maybe = value as { getQueryType?: unknown; getType?: unknown; }
	return (
		typeof maybe.getType === "function"
		&& typeof maybe.getQueryType === "function"
	)
}

// Structural type check — intentionally avoids graphql's realm-sensitive
// isNonNullType/instanceOf, which throws when the schema objects were produced
// by a different graphql copy than this rule's module graph.
function isNonNullType(type: unknown): boolean {
	if (type == null || typeof type !== "object") return false
	if (
		Symbol.toStringTag in type &&
		(type as Record<PropertyKey, unknown>)[Symbol.toStringTag] === NON_NULL_TAG
	) {
		return true
	}
	return (
		(type as { constructor?: { name?: string } }).constructor?.name === NON_NULL_TAG
	)
}

/**
 * Requires optional `version`-suffixed schema arguments to be passed by name.
 *
 * Some fields in the schema (e.g. Media.status, Media.source, Media.relationType)
 * declare a `version` argument that is optional in the schema but needed by the
 * app's correctness. This rule reports a Field node whose schema definition has
 * an optional (non-`!`) argument whose name matches /version$/i but does not
 * supply that argument by name in the selection set. The argument's value is
 * deliberately not guessed — the rule is report-only.
 *
 * The rule reads the schema from the parser's `graphQLConfig` wiring (the same
 * schema the rest of the repo lints against). If the schema is unavailable or a
 * field cannot be resolved, the rule stays quiet — the preexisting GraphQL
 * syntax/resolution errors remain the only signal.
 */
export const rule: GraphQLESLintRule<[], true> = {
	meta: {
		type: "problem",
		schema: [],
		messages: {
			missingVersionArg:
				"Field `{{ field }}` has an optional `{{ argument }}` argument in the schema, but it was not passed. {{ expectation }}",
		},
	},
	create(context) {
		const services = context.sourceCode.parserServices as null | undefined | { schema?: unknown }
		if (!isGraphQLSchema(services?.schema)) {
			return {}
		}

		return {
			Field(node: GraphQLESTreeNode<FieldNode, true>) {
				const fieldDef = node.typeInfo().fieldDef
				if (!fieldDef) {
					return
				}
				const args = fieldDef.args

				const passedArgs = new Set(
					(node.arguments ?? []).map((argument) => argument.name.value)
				)

				const fieldName = node.name.value

				for (const arg of args) {
					if (!/version$/i.test(arg.name)) {
						continue
					}
					if (isNonNullType(arg.type)) {
						// Required `!` argument — the schema already forces the caller.
						continue
					}
					if (passedArgs.has(arg.name)) {
						continue
					}

					const doc = arg.description?.trim()
					context.report({
						node,
						messageId: "missingVersionArg",
						data: {
							field: fieldName,
							argument: arg.name,
							expectation: doc ? `Schema doc: "${doc}".` : "",
						},
					})
				}
			},
		}
	},
}
