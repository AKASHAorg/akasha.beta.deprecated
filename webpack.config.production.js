import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
    devtool: 'cheap-module-source-map',

    entry: ['babel-polyfill', './app/index'],

    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '../dist/'
    },

    module: {
        rules: [
            // Extract all .global.css to style.css as is
            {
                test: /\.global\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader',
                })
            },
            {
                test: /\.module\.css$/,
                use: ExtractTextPlugin.extract({
                        loader: ['style-loader',
                            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]']
                    }
                )
            },
            // Pipe other styles through css modules and append to style.css
            {
                test: /^((?!\.global).)*\.css$/,
                use: ExtractTextPlugin.extract({
                    use: {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]__[hash:base64:5]',
                        }
                    }
                }),
            },
            {
                test: /^((?!\.global).)*\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader']
                })
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                    }
                },
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream'
                    }
                }
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader',
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml',
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader',
            }
        ]
    },

    plugins: [
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        /**
         * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
         */
        new BabiliPlugin(),

        new ExtractTextPlugin({filename: 'style.css', allChunks: true, ignoreOrder: true}),

        /**
         * Dynamically generate index.html page
         */
        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: 'app/app.template.html',
            inject: true
        })
    ],

    target: 'web'
});