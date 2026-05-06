import codspeedPlugin from "@codspeed/vitest-plugin"
import {
	defineProject,
	type UserWorkspaceConfig,
} from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	plugins: [codspeedPlugin()],
})
export default config
