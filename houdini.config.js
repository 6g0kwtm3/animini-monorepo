/** @type {import('houdini').ConfigFile} */
const config = {
	scalars: {
		Json: { type: "unknown" },
	},
	  
	plugins: {
		"./app/plugins/plugin.js": {
			client: "./app/client",
			mutations: {
				MediaList: {
					SaveMediaListEntry: [
						{ from: "status", to: "status" },
						{ from: "startedAt", to: "startedAt" },
						{ from: "score", to: "score" },
						{ from: "repeat", to: "repeat" },
						{ from: "progressVolumes", to: "progressVolumes" },
						{ from: "progress", to: "progress" },
						{ from: "notes", to: "notes" },
						{ from: "customLists", to: "customLists" },
						{ from: "completedAt", to: "completedAt" },
						{ from: "startedAt", to: "startedAt" },
						{ from: "advancedScores", to: "advancedScores" },
						{
							OR: [
								{ from: "id", to: "id" },
								{ from: "mediaId", to: "mediaId" },
								{ from: "media.id", to: "mediaId" },
							],
						},
					],
				},
			},
		},
	},
	include: ["app/**/*.{tsx,ts,js,jsx,graphql,gql}"],
}

export default config
