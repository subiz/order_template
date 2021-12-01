module.exports = {
	plugins: [
		['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
	],
	comments: false,
	presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3, targets: '> 5%, not dead' }]],
}
