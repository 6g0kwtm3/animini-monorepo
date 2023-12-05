import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import { kitRoutes } from "vite-plugin-kit-routes"
import type { KIT_ROUTES } from "~/lib/ROUTES"

export default defineConfig({
	plugins: [
		sveltekit(),
		kitRoutes<KIT_ROUTES>({
			format: "variables",
			LINKS: {
				authorize: {
					href: "https://www.anilist.co/api/v2/oauth/authorize",
					explicit_search_params: {
						client_id: { required: true, type: "string" },
						response_type: { default: "'token'", type: "'token'" },
					},
				},
				"anilist-logo":"https://www.anilist.co/img/icons/icon.svg"
			},
		}),
	],
	server: {
		port: 3000,
	},
})
