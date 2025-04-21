import type { Rule, SourceCode } from "eslint"
import type * as ESTree from "estree"
import {
	parse,
	type ASTNode,
	type DocumentNode,
	type FieldNode,
	type NameNode,
	type OperationDefinitionNode,
} from "graphql"

/**
 * Returns a range object for auto fixers.
 */
function getRange(
	context: Rule.RuleContext,
	templateNode: ESTree.TaggedTemplateExpression,
	graphQLNode: NameNode
): [number, number] {
	const graphQLStart = templateNode.quasi.quasis[0].range[0] + 1
	return [
		graphQLStart + graphQLNode.loc.start,
		graphQLStart + graphQLNode.loc.end,
	]
}

/**
 * Returns a loc object for error reporting.
 */
function getLoc(
	context: Rule.RuleContext,
	templateNode: ESTree.TaggedTemplateExpression,
	graphQLNode: NameNode
): ESTree.SourceLocation {
	const startAndEnd = getRange(context, templateNode, graphQLNode)
	const start = startAndEnd[0]
	const end = startAndEnd[1]
	return {
		start: getLocFromIndex(context.sourceCode, start),
		end: getLocFromIndex(context.sourceCode, end),
	}
}

// TODO remove after we no longer have to support ESLint 3.5.0
function getLocFromIndex(sourceCode: SourceCode, index: number) {
	if (sourceCode.getLocFromIndex) {
		return sourceCode.getLocFromIndex(index)
	}
	let pos = 0
	for (let line = 0; line < sourceCode.lines.length; line++) {
		const lineLength = sourceCode.lines[line].length
		if (index <= pos + lineLength) {
			return { line: line + 1, column: index - pos }
		}
		pos += lineLength + 1
	}
	return null
}

function isGraphQLTag(tag: ESTree.Expression) {
	return tag.type === "Identifier" && tag.name === "graphql"
}

function getGraphQLAST(
	taggedTemplateExpression: ESTree.TaggedTemplateExpression
) {
	if (!isGraphQLTag(taggedTemplateExpression.tag)) {
		return null
	}
	if (taggedTemplateExpression.quasi.quasis.length !== 1) {
		// has substitutions, covered by graphql-syntax rule
		return null
	}
	const quasi = taggedTemplateExpression.quasi.quasis[0]
	try {
		return parse(quasi.value.cooked)
	} catch (_error) {
		// Invalid syntax, covered by graphql-syntax rule
		return null
	}
}

function hasPrecedingEslintDisableComment(
	node: FieldNode | OperationDefinitionNode,
	commentText: string
) {
	const prevNode = node.loc?.startToken.prev
	return prevNode?.kind === "Comment" && prevNode.value.startsWith(commentText)
}

const ESLINT_DISABLE_COMMENT = " eslint-disable-next-line relay/unused-fields"

function getGraphQLFieldNames(graphQLAst: DocumentNode) {
	const fieldNames: Record<string, NameNode> = {}

	function walkAST(node: ASTNode, ignoreLevel?: boolean) {
		if (node.kind === "Field" && !ignoreLevel) {
			if (hasPrecedingEslintDisableComment(node, ESLINT_DISABLE_COMMENT)) {
				return
			}
			const nameNode = node.alias || node.name
			fieldNames[nameNode.value] = nameNode
		}
		if (node.kind === "OperationDefinition") {
			if (
				node.operation === "mutation"
				|| node.operation === "subscription"
				|| hasPrecedingEslintDisableComment(node, ESLINT_DISABLE_COMMENT)
			) {
				return
			}
			// Ignore fields that are direct children of query as used in mutation
			// or query definitions.
			node.selectionSet.selections.forEach((selection) => {
				walkAST(selection, true)
			})
			return
		}
		for (const prop in node) {
			const value = node[prop]
			if (prop === "loc") {
				continue
			}
			if (value && typeof value === "object") {
				walkAST(value)
			} else if (Array.isArray(value)) {
				value.forEach((child) => {
					walkAST(child)
				})
			}
		}
	}

	walkAST(graphQLAst)
	return fieldNames
}

function isGraphQLTemplate(node: ESTree.TaggedTemplateExpression) {
	return (
		node.tag.type === "Identifier"
		&& node.tag.name === "graphql"
		&& node.quasi.quasis.length === 1
	)
}

function isStringNode(
	node: ESTree.Expression | ESTree.SpreadElement | null | undefined
): node is ESTree.SimpleLiteral {
	return node != null && node.type === "Literal"
}

function isPageInfoField(field: string) {
	switch (field) {
		case "pageInfo":
		case "page_info":
		case "hasNextPage":
		case "has_next_page":
		case "hasPreviousPage":
		case "has_previous_page":
		case "startCursor":
		case "start_cursor":
		case "endCursor":
		case "end_cursor":
			return true
		default:
			return false
	}
}

export const rule: Rule.RuleModule = {
	meta: { docs: {}, schema: [] },
	create(context) {
		let currentMethod: string[] = []
		let foundMemberAccesses = new Set<string>()
		let templateLiterals: ESTree.TaggedTemplateExpression[] = []

		function visitGetByPathCall(node: ESTree.CallExpression) {
			// The `getByPath` utility accesses nested fields in the form
			// `getByPath(thing, ['field', 'nestedField'])`.
			const pathArg = node.arguments[1]
			if (!pathArg || pathArg.type !== "ArrayExpression") {
				return
			}
			pathArg.elements.forEach((element) => {
				if (isStringNode(element) && typeof element.value === "string") {
					foundMemberAccesses.add(element.value)
				}
			})
		}

		function visitDotAccessCall(node: ESTree.CallExpression) {
			// The `dotAccess` utility accesses nested fields in the form
			// `dotAccess(thing, 'field.nestedField')`.
			const pathArg = node.arguments[1]
			if (isStringNode(pathArg) && typeof pathArg.value === "string") {
				pathArg.value.split(".").forEach((element) => {
					foundMemberAccesses.add(element)
				})
			}
		}

		function visitMemberExpression(node: ESTree.MemberExpression) {
			if (node.property.type === "Identifier") {
				foundMemberAccesses.add(node.property.name)
			}
		}

		return {
			Program(_node) {
				currentMethod = []
				foundMemberAccesses = new Set<string>()
				templateLiterals = []
			},
			"Program:exit"(_node) {
				templateLiterals.forEach((templateLiteral) => {
					const graphQLAst = getGraphQLAST(templateLiteral)
					if (!graphQLAst) {
						// ignore nodes with syntax errors, they're handled by rule-graphql-syntax
						return
					}

					const queriedFields = getGraphQLFieldNames(graphQLAst)
					for (const field in queriedFields) {
						if (
							!foundMemberAccesses.has(field)
							&& !isPageInfoField(field)
							// Do not warn for unused __typename which can be a workaround
							// when only interested in existence of an object.
							&& field !== "__typename"
						) {
							context.report({
								node: templateLiteral,
								loc: getLoc(context, templateLiteral, queriedFields[field]),
								message:
									`This queries for the field \`${field}\` but this file does `
									+ "not seem to use it directly. If a different file needs this "
									+ "information that file should export a fragment and colocate "
									+ "the query for the data with the usage.\n"
									+ "If only interested in the existence of a record, __typename "
									+ "can be used without this warning.",
							})
						}
					}
				})
			},
			CallExpression(node) {
				if (node.callee.type !== "Identifier") {
					return
				}
				switch (node.callee.name) {
					case "getByPath":
						visitGetByPathCall(node)
						break
					case "dotAccess":
						visitDotAccessCall(node)
						break
				}
			},
			TaggedTemplateExpression(node) {
				if (currentMethod.at(-1) === "getConfigs") {
					return
				}
				if (isGraphQLTemplate(node)) {
					templateLiterals.push(node)
				}
			},
			MemberExpression: visitMemberExpression,
			OptionalMemberExpression: visitMemberExpression,
			ObjectPattern(node) {
				node.properties.forEach((node) => {
					if (node.type === "Property" && !node.computed) {
						foundMemberAccesses.add(node.key.name)
					}
				})
			},
			MethodDefinition(node) {
				currentMethod.push(node.key.name)
			},
			"MethodDefinition:exit"(_node) {
				currentMethod.pop()
			},
		}
	},
}
