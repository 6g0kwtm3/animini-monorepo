import { setup } from "@ark/attest"
import { ModuleResolutionKind } from "typescript"

export default () =>
	setup({
		compilerOptions: {
			moduleResolution: "Bundler" as unknown as ModuleResolutionKind.Bundler,
		},
	})
