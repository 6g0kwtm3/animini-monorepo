type FieldMap = { from: string; to: string } | { OR: FieldMap[] }

export interface Config {
	/**
	 * A relative path from your houdini.config.js to the file that exports your client as its default value
	 * @default `./app/client`
	 */
	client?: string
	mutations?: Record<string, Record<string, FieldMap[]>>
}

declare module "houdini" {
	interface HoudiniPluginConfig {
		"remix-run"?: Config
		"./app/plugins/plugin.js"?: Config
	}
}
