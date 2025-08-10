/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
	_comment:
		"This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
	packageManager: "pnpm",
	reporters: ["html", "progress", "dashboard"],
	testRunner: "vitest",
	testRunner_comment:
		"Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.",
	coverageAnalysis: "perTest",
	plugins: ["@stryker-mutator/vitest-runner", "@stryker-mutator/typescript-checker"],
	mutate: [
		"+(apps|packages)/*/{src,app}/**/!(*.+(s|S)pec|*.+(t|T)est).+(cjs|mjs|js|ts|mts|cts|jsx|tsx|html|vue|svelte)",
		"!{src,lib}/**/__tests__/**/*.+(cjs|mjs|js|ts|mts|cts|jsx|tsx|html|vue|svelte)",
	],
	checkers: ["typescript"],
	tsconfigFile: "tsconfig.json",
	typescriptChecker: { prioritizePerformanceOverAccuracy: true },
}
