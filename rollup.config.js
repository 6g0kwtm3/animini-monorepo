import { defineConfig } from "rollup"
import { dts } from "rollup-plugin-dts"

export default defineConfig(
	["m3-core", "m3-react"].map(
		/** @returns {import('rollup').RollupOptions} */
		(pkg) => ({
			input: `./tmp/packages/${pkg}/src/index.d.ts`,
			output: {
				file: `packages/${pkg}/dist/${pkg}.d.ts`,
				format: "esm",
			},
			plugins: [dts()],
		})
	)
)
