import { tvTransformer } from "tailwind-variants/transformer"
import { type PluginOption } from "vite"
import { screens } from "./screens"

export function tvTransform(): PluginOption {
	return {
		enforce: "pre",
		name: "tv-transformer",
		transform(src, id) {
			if (/\.[jt]sx?$/.test(id)) {
				return {
					code: tvTransformer(src, Object.keys(screens)),
					map: null,
				}
			}
		},
	}
}
