var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: {
		preview: './preview.js',
		// ssr: './ssr.js',
	},
	output: {publicPath: '/'},
	devServer: {port: 8089, host: '0.0.0.0', hot: false, liveReload: false},
	optimization: {minimize: false},
	plugins: [
		new HtmlWebpackPlugin({
			filename: './preview.html',
			template: './preview.html',
			inject: 'body',
			chunks: ['preview'],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(svg|png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false, // so we dont have to use .default
							name: '[path][name].[hash:7].[ext]', // full path structure
						},
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules\/(?!(@subiz\/storage)\/).*/,
				use: [{loader: 'babel-loader'}],
			},
		],
	},
}
