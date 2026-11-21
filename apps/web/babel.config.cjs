module.exports = {
	presets: [["@babel/preset-typescript", { onlyRemoveTypeImports: true }]],
	babelrc: false,
	plugins: ["babel-plugin-react-compiler", "@babel/plugin-syntax-jsx"],
}
