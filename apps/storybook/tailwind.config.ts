import type { Config } from "tailwindcss"
import { m3Plugin } from "m3-core/plugin"

export default {
	content: ["stories/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
	plugins: [m3Plugin()],
} satisfies Config
