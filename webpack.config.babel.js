import HtmlWebPackPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default (env, argv) => {
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
                    test: /\.(s*)css$/,
                    // use: ExtractTextPlugin.extract(
                    // {
                    //     fallback: 'style-loader',
                    //     use: ['css-loader','sass-loader']
                    // }),
                    use() {
                        if (argv.mode === 'development') {
                            return ExtractTextPlugin.extract( {
                                fallback: 'style-loader',
                                use: ['css-loader','sass-loader']
                            } )
                        }
                        return [
                            { loader: "style-loader" },
                            { loader: "css-loader" },
                            { loader: "sass-loader" },
                        ]
                    }
                  },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                if (argv.mode === 'development') {
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
            }),
            new ExtractTextPlugin( { filename: 'style.bundle.css' } ),
        ],
    }
}