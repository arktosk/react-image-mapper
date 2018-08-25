import HtmlWebPackPlugin from "html-webpack-plugin";

export default ( env, argv ) => {
    return {
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    use: [{
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: "[name]_[local]_[hash:base64]",
                                sourceMap: true,
                                minimize: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name ( file ) {
                                if ( argv.mode === 'development' ) {
                                    return 'images/[name].[ext]'
                                }
                                return 'images/[hash].[ext]'
                            },
                            context: '',
                        }
                    }]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./public/index.html",
                filename: "./index.html",
                title: 'React Image Mapper Component',
            })
        ]
    }
}