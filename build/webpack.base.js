const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')
const base_config = {
  entry: {
    main: './src/modules/main'
  },
  output: {
    path: path.join(__dirname, '/../dist'),
    filename: '[name].js'// 根据入口文件命名文件，[name]_[hash], 在文件名后加入 hash 值作为文件名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'webpack-demo-html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      }
    }),
    new ExtractTextPlugin ({
      filename: 'index.css',
      allChunks: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", 'postcss-loader']
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader', "sass-loader"]
        })
      }
    ]
  }
}
module.exports = base_config