import { withTV } from "tailwind-variants/dist/transformer.js"
import { config } from "./tailwind.config"

export default withTV({
	...config,
	content: [
		...config.content,
		"stories/**/*.{ts,tsx}",
		".storybook/**/*.{ts,tsx}",
	],
})
