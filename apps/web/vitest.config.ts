import { defineProject, type UserWorkspaceConfig } from "vite-plus"

const config: UserWorkspaceConfig = defineProject({
	test: { exclude: ["**/node_modules/**", "**/.git/**", "./tests/**"] },
})
export default config
