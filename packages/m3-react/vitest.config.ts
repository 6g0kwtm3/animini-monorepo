import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineProject, type UserWorkspaceConfig } from "vite-plus";

const config: UserWorkspaceConfig = defineProject({
  plugins: [codspeedPlugin()],
});
export default config;
