import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// @TODO extract akasha themes in separated files
export default merge(baseConfig, {
    devtool: 'source-map',

    entry: ['./app/index'],

    output: {
        path: path.join(__dirname, 'dist')
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
                    use: ['style-loader',
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
                            minimize: true
                        }
                    }
                }),
            },
            {
                test: /^((?!\.global).)*\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&minimize&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader']
                })
            },
            {
                test: /^((?!\.global).)*\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?importLoaders=1&minimize&localIdentName=[name]__[local]___[hash:base64:5]', 'less-loader']
                })
            },
            {
                test: /\.woff(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                },
            },
            {
                test: /\.woff2(\?[a-z0-9-=]+)?$/,
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
                test: /\.ttf(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream',
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.eot(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.svg(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml',
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
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
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.DARK_THEME': JSON.stringify(process.env.DARK_THEME)
        }),
        /**
         * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
         */
        new UglifyJSPlugin({
            parallel: true,
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: (process.env.DARK_THEME) ? 'dark-style.css' : 'style.css',
            allChunks: true,
            ignoreOrder: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        /**
         * Dynamically generate index.html page
         */
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'app/app.template.html',
            inject: false
        })
    ],

    target: 'web'
});
