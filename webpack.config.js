const path = require('path'),
  HtmlWebPackPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    bundle: [
      path.join(__dirname, './src/client/index.js'),
      path.join(__dirname, './src/client/index.scss')
    ]
  },
  output: {
    publicPath: '/',
  },
  devtool: "sourcemap",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, './src'),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          }, 
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
          }
        }, 
        {
          loader: 'sass-loader' // compiles Sass to CSS
        }
      ]
    }]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, "./views/index.html"),
      // filename: path.join(__dirname, "./dist/index.html")
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};