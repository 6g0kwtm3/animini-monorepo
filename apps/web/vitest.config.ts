import { defineProject, type UserWorkspaceConfig } from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	test: { exclude: ["**/node_modules/**", "**/.git/**", "./tests/**"] },
})
export default config
