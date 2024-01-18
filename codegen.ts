import type { CodegenConfig } from "@graphql-codegen/cli"

import { preset } from "@graphql-codegen/client-preset"
import type { PluginFunction, Types } from "@graphql-codegen/plugin-helpers"
import dedent from "dedent"
import { groupBy } from "effect/ReadonlyArray"
import { Kind, buildASTSchema, print, visit } from "graphql"

import { optimizeDocuments } from "@graphql-tools/relay-operation-optimizer"
import path from "node:path"
const genResolvers: PluginFunction = (schema, documents, config, info) => {
	const fragments = documents
		.flatMap(
			({ document, location }) =>
				document?.definitions.map((definition) => ({
					definition,
					location,
				})) ?? [],
		)
		.flatMap(({ definition, location }) =>
			definition?.kind === Kind.FRAGMENT_DEFINITION &&
			definition.directives?.some(
				(directive) => directive.name.value === "component",
			)
				? [{ fragment: definition, location }]
				: [],
		)

	 

	return {
		prepend: [],
		content: dedent`
		  import { stitchSchemas } from "@graphql-tools/stitch"

			import type { ExecutionResult } from "graphql"
			import { GraphQLError, execute } from "graphql"
			
			import { buildHTTPExecutor } from "@graphql-tools/executor-http"
			
			import { mergeResolvers } from "@graphql-tools/merge"
			
			import { makeExecutableSchema } from "@graphql-tools/schema"
			
			import type { TypedDocumentNode as DocumentTypeDecoration } from "@graphql-typed-document-node/core"
			import type { SerializeFrom } from "@remix-run/node"
			
			import { parse, stringify } from "devalue"
			import { useMemo } from "react"
			import mainfile from "../../schema.graphql?raw"
			import typeDefs from "./.schema.graphql?raw"

			${fragments
				.map(({ fragment, location }, i) => {
					const relativePath = path.parse(
						path.relative(
							(path.join(process.cwd(), info?.outputFile || "","..")),
							location || "",
						),
					)

					return dedent`import { default as ${
						fragment.name.value
					} } from "${path
						.join(relativePath.dir, relativePath.name)
						.replaceAll("\\", "/")}"`
				})
				.join("\n")}

			class Box{constructor(public data:any,public name:any){}}

	
			${fragments
				.map(
					({ fragment, location }, i) => dedent`
				const ${fragment.name.value}Resolvers = {
      ${fragment.typeCondition.name.value}: {${fragment.name.value}: {
        selectionSet: \`${print(fragment.selectionSet)}\`,
        resolve: (data: any) => new Box(data, "${fragment.name.value}")}
      }
    }`,
				)
				.join("\n")}


		 

				
				const mainschema = {
					schema: makeExecutableSchema({
						typeDefs: mainfile,
					}),
					batch: true,
					executor: buildHTTPExecutor({
						endpoint: "https://graphql.anilist.co",
					}),
				}
				

				export const resolvers = mergeResolvers([${fragments
					.map(
						({ fragment, location }, i) => dedent`
					${fragment.name.value}Resolvers`,
					)
					.join(",")}
				])
			
				const components: any = {${fragments
					.map(
						({ fragment, location }, i) =>
							`${fragment.name.value}:${fragment.name.value}`,
					)
					.join(",")}}

				abstract class Ref<T> {
					protected opaque!: T
				}
				
				type PreserveRef<T> = {
					[K in keyof T]: T[K] extends Ref<any> ? T[K] : SerializeFrom<T[K]>
				}
				
				declare module "@remix-run/react" {
					export function useLoaderData<T>(): T extends (...args: any[]) => infer Output
						? PreserveRef<Awaited<Output>>
						: PreserveRef<Awaited<T>>
				}

				function ref<T>(value: T) {
					return stringify(value, {
						Box: (value) => value instanceof Box && { data: {...value.data}, name:value.name },
						GraphqlError: (value) => value instanceof GraphQLError && { ...value },
					}) as unknown as Ref<T>
				}
				
				function unref<T>(value: Ref<T>) {
					return parse(value as unknown as string, {
						Box: ({ data, name }) => {
							return components[name](data)
						},
						GraphqlError: (data) => new GraphQLError(data.message, data),
					}) as unknown as T
				}
				
				import {getClient} from "~/lib/urql"

				export async function loadQuery<T, V extends { readonly [variable: string]: unknown; }>(
					request: Request,
					document: DocumentTypeDecoration<T>,
					variableValues: V
				): Promise<Ref<ExecutionResult<T>>> {
					const {data, error} = (await getClient(request).query(document, variableValues)) as ExecutionResult<T>

					if(error)console.error(error)
				
					return ref({data})
				}
				
				export function useQuery<T>(ref: Ref<ExecutionResult<T>>): ExecutionResult<T> {
					return useMemo(() => unref(ref), [ref])
				}
				`,
		append: [],
	}
}
const genTypedefs = ((schema, documents) => {
	const fragments = documents
		.flatMap(
			({ document, location }) =>
				document?.definitions.map((definition) => ({
					definition,
					location,
				})) ?? [],
		)
		.flatMap(({ definition, location }) =>
			definition?.kind === Kind.FRAGMENT_DEFINITION &&
			definition.directives?.some(
				(directive) => directive.name.value === "component",
			)
				? [{ fragment: definition, location }]
				: [],
		)

	const groups = groupBy(
		fragments,
		({ fragment }) => fragment.typeCondition.name.value,
	)

	let i = 0
	
	return {
		prepend: [],
		content:
			`directive @component(url: String) on SCALAR | FRAGMENT_DEFINITION\ndirective @_client on FIELD\n` +
			Object.entries(groups)
				.map(([key, fragments]) => {
					const typeDefs = `${fragments
						.map(
							({ location, fragment }, j) =>
								`scalar ${fragment.name.value} @component(url: "${
									// relative(process.cwd(),location,).replaceAll("\\", "\\\\")
									location
								}")`,
						)
						.join("\n")}

type ${key} {
	${fragments
		.map(({ fragment }, j) => `${fragment.name.value}: ${fragment.name.value}!`)
		.join("\n")}
}
				`
					i += fragments.length
					return typeDefs
				})
				.join("\n"),
		append: [],
	}
}) satisfies PluginFunction

const componentsPreset = {
	buildGeneratesSection(options) {
		const pluginMap = {
			"gen-schema": { plugin: genTypedefs },
			"gen-resolvers": { plugin: genResolvers },
		}

		return [
			{
				...options,
				filename: `${options.baseOutputDir}.schema.graphql`,
				plugins: [{ "gen-schema": {} }],
				pluginMap,
				config: { skipDocumentsValidation: true },
			},
			{
				...options,
				filename: `${options.baseOutputDir}resolvers.tsx`,
				plugins: [{ "gen-resolvers": {} }],
				pluginMap,
				config: {
					skipDocumentsValidation: true,
				},
			},
		]
	},
} satisfies Types.OutputPreset

const config: CodegenConfig = {
	documents: ["app/**/*.{ts,tsx}"],
	emitLegacyCommonJSImports: false,
	ignoreNoDocuments: true,
	config: {
		avoidOptionals: {
			field: true,
			inputValue: false,
		},
		defaultScalarType: "unknown",
		dedupeFragments: true,
		scalars: { Json: "~/lib/urql#JSONValue" },
		skipDocumentsValidation: true,
	},
	generates: {
		"app/schema/": {
			schema: "schema.graphql",
			preset: componentsPreset,
			presetConfig: {
				generates: {},
			},
		},
		"app/gql/": {
			schema: ["schema.graphql", "app/schema/.schema.graphql"],
			preset: {
				buildGeneratesSection(options) {
					let components: Record<
						string,
						string | { input: string; output: string }
					> = {}

					visit(options.schema, {
						ScalarTypeDefinition(node) {
							const component = node.directives?.find(
								(directive) => directive.name.value === "component",
							)
							const url = component?.arguments?.[0]?.value
							if (url?.kind !== Kind.STRING) {
								return false
							}

							components[node.name.value] = {
								input: "never",
								output: `ReturnType<typeof import("${url.value}").default>`,
							}
						},
					})

					options.config["scalars"] = {
						...components,
						...options.config["scalars"],
					}

					return preset.buildGeneratesSection(options)
				},
				prepareDocuments: preset.prepareDocuments,
			},
			plugins: ["typescript-urql-graphcache"],
			config: {
				useTypeImports: true,
			},
			documentTransforms: [
				{
					transform({ documents, schema, config, pluginContext }) {
						const fragments = Object.fromEntries(
							documents
								.flatMap(({ document }) =>
									document ? document.definitions : [],
								)
								.flatMap((definition) =>
									definition.kind === Kind.FRAGMENT_DEFINITION
										? [[definition.name.value, definition]]
										: [],
								),
						)

						// return documents

						const docs = optimizeDocuments(
							buildASTSchema(schema),
							documents.flatMap(({ document }) => (document ? [document] : [])),
							// {
							//   includeFragments: true,
							// },
						)

						return docs
							.concat(
								Object.values(fragments).map((definition) => ({
									definitions: [definition],
									kind: Kind.DOCUMENT,
								})),
							)
							.map((document) => ({ document }))
					},
				},
			],
		},
		"app/gql/introspection.json": {
			schema: ["schema.graphql", "app/schema/.schema.graphql"],
			plugins: ["urql-introspection"],
		},
	},
}

export default config
