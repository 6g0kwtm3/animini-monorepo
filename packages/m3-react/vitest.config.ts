import codspeedPlugin from "@codspeed/vitest-plugin"
import {
	defineProject,
	type Plugin,
	type UserWorkspaceConfig,
} from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	plugins: [codspeedPlugin() as Plugin],
})
export default config
