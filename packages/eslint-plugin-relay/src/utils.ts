import type { Rule } from "eslint"
import type * as ESTree from "estree"
import { parse, TokenKind, type ASTNode, type NameNode } from "graphql"
import path from "path"

export function hasPrecedingEslintDisableComment(
	node: ASTNode,
	commentText: string
) {
	const prevNode = node.loc?.startToken.prev
	return (
		prevNode?.kind === TokenKind.COMMENT
		&& prevNode.value.startsWith(commentText)
	)
}

/**
 * Returns a range object for auto fixers.
 */
export function getRange(
	context: Rule.RuleContext,
	templateNode: GraphqlTemplateExpression,
	graphQLNode: NameNode
): [number, number] {
	const graphQLStart = templateNode.quasi.quasis[0].range![0] + 1
	return [
		graphQLStart + graphQLNode.loc!.start,
		graphQLStart + graphQLNode.loc!.end,
	]
}

/**
 * Returns a loc object for error reporting.
 */
export function getLoc(
	context: Rule.RuleContext,
	templateNode: GraphqlTemplateExpression,
	graphQLNode: NameNode
): ESTree.SourceLocation {
	const startAndEnd = getRange(context, templateNode, graphQLNode)
	const start = startAndEnd[0]
	const end = startAndEnd[1]
	return {
		start: context.sourceCode.getLocFromIndex(start),
		end: context.sourceCode.getLocFromIndex(end),
	}
}

export interface GraphqlIdentifier extends ESTree.Identifier {
	name: "graphql"
}

export interface GraphqlTemplateLiteral extends ESTree.TemplateLiteral {
	quasis: [ESTree.TemplateElement]
}

export interface GraphqlTemplateExpression
	extends ESTree.TaggedTemplateExpression {
	tag: GraphqlIdentifier
	quasi: GraphqlTemplateLiteral
}

export function isGraphQLTemplate(
	node: ESTree.TaggedTemplateExpression
): node is GraphqlTemplateExpression {
	return (
		node.tag.type === "Identifier"
		&& node.tag.name === "graphql"
		&& node.quasi.quasis.length === 1
	)
}

// Copied directly from Relay
export function getModuleName(filePath: string) {
	// index.js -> index
	// index.js.flow -> index.js
	let filename = path.basename(filePath, path.extname(filePath))

	// index.js -> index (when extension has multiple segments)
	// index.react -> index (when extension has multiple segments)
	filename = filename.replace(/(\.(?!ios|android)[_a-zA-Z0-9\\-]+)+/g, "")

	// /path/to/button/index.js -> button
	let moduleName =
		filename === "index" ? path.basename(path.dirname(filePath)) : filename

	// foo-bar -> fooBar
	// Relay compatibility mode splits on _, so we can't use that here.
	moduleName = moduleName.replace(/[^a-zA-Z0-9]+(\w?)/g, (match, next) =>
		next.toUpperCase()
	)

	return moduleName
}

export function getGraphQLAST(
	taggedTemplateExpression: GraphqlTemplateExpression
) {
	const quasi = taggedTemplateExpression.quasi.quasis[0]
	try {
		if (typeof quasi.value.cooked === "string") {
			return parse(quasi.value.cooked)
		}
	} catch {
		// Invalid syntax, covered by graphql-syntax rule
	}
	return null
}
