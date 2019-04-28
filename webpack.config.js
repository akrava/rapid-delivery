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
                        loader: 'css-loader',
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }, 
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.join(__dirname, "./src/client/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};