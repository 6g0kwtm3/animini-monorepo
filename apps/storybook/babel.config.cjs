module.exports = {
	presets: [
		[
			"@babel/preset-typescript",
			{ onlyRemoveTypeImports: true, allExtensions: true, isTSX: true },
		],
	],
	babelrc: false,
	plugins: [
		[
			"@stylexjs/babel-plugin",
			{
				dev: process.env.NODE_ENV === "development",
				test: process.env.NODE_ENV === "test",
				runtimeInjection: false,
				treeshakeCompensation: true,
				unstable_moduleResolution: { type: "commonJS" },
			},
		],
	],
}
