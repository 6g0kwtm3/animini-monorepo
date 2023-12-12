import { Kind, print } from "graphql"
import {
	ArtifactKind,
	ensureArtifactImport,
	ensureImports,
	find_graphql,
	parseJS,
	path,
	plugin,
	printJS,
	routerConventions,
} from "houdini"
import * as recast from "recast"

const AST = recast.types.builders

/**
 * @param {import('houdini').Config} config
 * @returns {import('./plugin').Config} */
function pluginConfig(config) {
	return {
		client: "./app/client",
		mutations: {},
		...config.pluginConfig("remix-run"),
	}
}

export default plugin("remix-run", async () => {
	return {
		order: "core",

		schema({ config }) {
			return print({
				kind: Kind.DOCUMENT,
				definitions: [
					{
						kind: Kind.SCALAR_TYPE_DEFINITION,
						name: {
							kind: Kind.NAME,
							value: "MutationFunction",
						},
					},
					...Object.entries(pluginConfig(config).mutations ?? {}).map(
						/**
						 * @returns {import('graphql').ObjectTypeDefinitionNode}
						 * */
						([key, value]) => ({
							kind: Kind.OBJECT_TYPE_DEFINITION,
							name: {
								kind: Kind.NAME,
								value: key,
							},
							fields: Object.entries(value).map(
								/**
								 * @returns {import('graphql').FieldDefinitionNode}
								 * */
								([mutationName, fieldMap]) => {
									return {
										kind: Kind.FIELD_DEFINITION,
										name: {
											kind: Kind.NAME,
											value: mutationName,
										},
										type: {
											kind: Kind.NAMED_TYPE,
											name: { kind: Kind.NAME, value: "MutationFunction" },
										},
									}
								},
							),
						}),
					),
				],
			})

			return /* GraphQL */ `
				directive @primary on FRAGMENT_SPREAD
			`
		},

		// add the jsx extensions
		extensions: [".jsx", ".tsx"],
		async extractDocuments({ content, config, filepath }) {
			// only consider tsx and jsx files
			if (!filepath.endsWith(".tsx") && !filepath.endsWith(".jsx")) {
				return []
			}

			// parse the content
			const parsed = parseJS(content, { plugins: ["jsx"] })

			// the documents  we've found
			const documents = []
			// use the houdini utility to search for the graphql functions
			await find_graphql(config, parsed, {
				tag(tag) {
					documents.push(tag.tagContent)
				},
			})

			return documents
		},
		async transformFile(page) {
			// only consider jsx or tsx files for now
			if (!page.filepath.endsWith(".tsx") && !page.filepath.endsWith(".jsx")) {
				return { code: page.content, map: page.map }
			}
			// parse the content and look for an invocation of the graphql function
			const script = parseJS(page.content, { plugins: ["jsx"] })

			// for now, just replace them with a string
			await find_graphql(page.config, script, {
				skipGraphqlType: true,
				tag({ node, artifact, parsedDocument, parent }) {
					const artifactID = ensureArtifactImport({
						config: page.config,
						artifact,
						body: script.body,
					})

					// we are going to replace the query with an object
					const properties = [
						AST.objectProperty(
							AST.stringLiteral("artifact"),
							AST.identifier(artifactID),
						),
					]

					// NOTE: this structure is duplicated for componentFields (fragments). if any changes are made here
					// please make sure they are copied there too if appropriate

					// extract the document metadata
					const { paginated, componentFields } =
						page.config.localDocumentData(parsedDocument)

					// if the query is paginated or refetchable then we need to add a reference to the refetch artifact
					if (paginated) {
						// if the document is a query then we should use it as the refetch artifact
						let refetchArtifactName = artifactID
						if (artifact.kind !== ArtifactKind.Query) {
							refetchArtifactName = page.config.paginationQueryName(
								artifact.name,
							)

							ensureArtifactImport({
								config: page.config,
								artifact: {
									name: refetchArtifactName,
								},
								body: script.body,
							})
						}

						properties.push(
							AST.objectProperty(
								AST.stringLiteral("refetchArtifact"),
								AST.identifier(refetchArtifactName),
							),
						)
					}

					// if the document refers to component fields then we need to make sure we import
					// each component field entry point
					for (const field of componentFields) {
						// the path of the entry point
						const entryPointPath = routerConventions.componentField_unit_path(
							page.config,
							page.config.componentFieldFragmentName({
								type: field.type,
								entry: field.field,
							}),
						)

						// import the entry point
						ensureImports({
							config: page.config,
							body: script.body,
							sourceModule: path.relative(
								page.config.projectRoot,
								entryPointPath,
							),
							// we just want the side effects of the import so we don't need to assign it to a variable
							import: null,
						})
					}

					// replace the graphql function with the object
					node.replaceWith(AST.objectExpression(properties))
				},
			})

			return printJS(script, {
				useTabs: true,
			})
		},
	}
})
