import { client } from "../feature-flags"

export default {
	get(): boolean {
		return client.getBooleanValue("theme_media_list_item", false)
	},
}
