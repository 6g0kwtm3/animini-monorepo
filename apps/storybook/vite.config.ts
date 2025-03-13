import tailwindcss from "@tailwindcss/vite"
import icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import oxlintPlugin from "vite-plugin-oxlint"

import { tvTransform } from "m3-core"

export default defineConfig({
	plugins: [
		oxlintPlugin({ configFile: "../../oxlintrc.json" }),
		tvTransform(),
		tailwindcss(),
		icons({
			compiler: "jsx",
			jsx: "react",
			iconCustomizer(_collection, _icon, props) {
				props.width = "1em"
				props.height = "1em"
			},
		}),
	],
})
