const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: [
            './dev/index.js',
        ],
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [['@babel/preset-env']]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            path: path.resolve(__dirname, 'public'),
            filename: 'main.bundle.css',
        }),
    ]
};