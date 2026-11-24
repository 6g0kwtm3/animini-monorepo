import { client } from "~/lib/feature-flags"

export default {
	get(): boolean {
		return client.getBooleanValue("enable_sanitizer_web_api", false)
	},
}
