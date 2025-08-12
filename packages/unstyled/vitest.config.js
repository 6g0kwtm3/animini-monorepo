import { defineProject } from "vitest/config"
import codspeedPlugin from "@codspeed/vitest-plugin"

export default defineProject({ plugins: [codspeedPlugin()] })
