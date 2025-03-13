import typography from "@tailwindcss/typography"
import { m3Plugin } from "m3-core"
import type { Config } from "tailwindcss"

export default {
	content: ["app/**/*.{ts,tsx}"],
	plugins: [typography, m3Plugin()],
} satisfies Config
