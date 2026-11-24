import { defineProject, type UserWorkspaceConfig } from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	test: { include: ["**/*.spec.ts"] },
})

export default config
