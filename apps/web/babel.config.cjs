module.exports = {
	babelrc: false,
	plugins: ["babel-plugin-react-compiler"],
	presets: [
		[
			"@babel/preset-typescript",
			{ allExtensions: true, isTSX: true, onlyRemoveTypeImports: true },
		],
	],
}
