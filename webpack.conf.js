var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {index: './index.js'},
	output: {publicPath: './'}, // so we can access html locally
	devServer: {port: 8089, host: '0.0.0.0', hot: false, liveReload: false},
	optimization: {minimize: false},
	plugins: [
		new HtmlWebpackPlugin({filename: './index.html', template: './index.html', inject: 'body', chunks: ['index']}),
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
