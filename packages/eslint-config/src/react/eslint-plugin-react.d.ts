declare module "eslint-plugin-react" {
	import type { Linter } from "eslint"
	const plugin: {
		configs: {
			flat: {
				recommended: Linter.Config
				"jsx-runtime": Linter.Config
			}
		}
	}
	export default plugin
}
