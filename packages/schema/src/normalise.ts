import { visit, Kind } from "graphql"

import type {
	DocumentNode,
	FieldDefinitionNode,
	InputValueDefinitionNode,
	TypeNode,
} from "graphql"

/**
 * The one normalisation rule the schema pipeline applies, and the reason
 * the artifact needs a re-emit at all: a field whose name is exactly `id`
 * and whose type is exactly `Int!` becomes `ID!`. Everything else — nullable
 * `id: Int` fields (kept as-is), relation ids (`activityId`, `threadCommentId`,
 * ...), `id: String` — is deliberately untouched.
 */

const ID_TYPE = {
	kind: Kind.NON_NULL_TYPE,
	type: { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: "ID" } },
} as const satisfies TypeNode

function isNonNullIntIdField(
	node: FieldDefinitionNode | InputValueDefinitionNode
): boolean {
	const type = node.type
	return (
		node.name.value === "id"
		&& type.kind === Kind.NON_NULL_TYPE
		&& type.type.kind === Kind.NAMED_TYPE
		&& type.type.name.value === "Int"
	)
}

function rewrite(
	node: FieldDefinitionNode | InputValueDefinitionNode
): FieldDefinitionNode | InputValueDefinitionNode {
	if (!isNonNullIntIdField(node)) return node
	return { ...node, type: ID_TYPE }
}

export function normaliseSchema(doc: DocumentNode): {
	changed: number
	doc: DocumentNode
} {
	let changed = 0
	const definitions = visit(doc, {
		FieldDefinition: (node) => {
			const rewritten = rewrite(node)
			if (rewritten !== node) changed += 1
			return rewritten
		},
		InputValueDefinition: (node) => {
			const rewritten = rewrite(node)
			if (rewritten !== node) changed += 1
			return rewritten
		},
	})
	return { changed, doc: definitions }
}
