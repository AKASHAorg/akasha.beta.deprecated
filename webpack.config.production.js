import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
//import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// @TODO extract akasha themes in separated files
export default merge(baseConfig, {
    devtool: 'source-map',
    entry: [process.env.DARK_THEME ? './app/index-dark.js': './app/index.js'],

    output: {
        path: path.join(__dirname, 'dist')
    },
    mode: 'production',
    module: {
        rules: [
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
                            minimize: true,
                            sourceMap: true
                        }
                    }
                }),
            },
            {
                test: /^((?!\.global).)*\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&minimize&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader?sourceMap']
                })
            },
            {
                test: /^((?!\.global).)*\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?importLoaders=1&minimize&localIdentName=[name]__[local]___[hash:base64:5]', 'less-loader?javascriptEnabled&sourceMap']
                })
            },
            {
                test: /\.woff(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'file-loader',
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
                    loader: 'file-loader',
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
                    loader: 'file-loader',
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
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.svg(\?[a-z0-9-=]+)?$/,
                use: {
                    loader: 'file-loader',
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
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/images/[name].[ext]'
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
            'process.env.DARK_THEME': JSON.stringify(process.env.DARK_THEME),
            'process.env.AKASHA_VERSION': JSON.stringify('beta#1')
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
            inject: true
        })
    ],

    target: 'web'
});
