import codspeedPlugin from "@codspeed/vitest-plugin"
import {
	defineProject,
	type UserWorkspaceConfig,
	type Plugin,
} from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	plugins: [codspeedPlugin()],
})
export default config
