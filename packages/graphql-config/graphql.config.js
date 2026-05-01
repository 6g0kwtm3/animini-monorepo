/** @type {import('graphql-config').IGraphQLConfig} */
export default {
	projects: {
		web: {
			schema: "./apps/web/schema.graphql",
			documents: "./apps/web/app/**/*.{ts,tsx}",
		},
	},
}
