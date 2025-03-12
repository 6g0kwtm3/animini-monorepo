import tailwindcss from "@tailwindcss/vite"
import oxlintPlugin from "vite-plugin-oxlint"
import { defineConfig, type PluginOption } from "vite"
import icons from "unplugin-icons/vite"

export default defineConfig({
	plugins: [
		oxlintPlugin({ configFile: "./node_modules/oxlint-config/oxlintrc.json" }),
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

function tvTransform(): PluginOption {
	return {
		enforce: "pre",
		name: "tv-transformer",
		transform(src, id) {
			if (/\.[jt]sx?$/.test(id)) {
				return {
					code: tvTransformer(src, Object.keys(tailwindConfig.theme.screens)),
					map: null,
				}
			}
		},
	}
}
