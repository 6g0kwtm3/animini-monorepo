module.exports = {
	presets: [
		[
			"@babel/preset-typescript",
			{ onlyRemoveTypeImports: true, allExtensions: true, isTSX: true },
		],
	],
	babelrc: false,
	plugins: [["babel-plugin-react-compiler", { target: "19" }]],
}
