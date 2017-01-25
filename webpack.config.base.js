/* eslint strict: 0 */

'use strict';

const path = require('path');
const cssnano = require('cssnano');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = {
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            loaders: ['babel-loader'],
            exclude: path.resolve(__dirname, 'node_modules')
        }
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.join(__dirname, 'app'),
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
        modulesDirectories: ['node_modules', 'constants', 'local-flux', 'shared-components', 'locale-data', 'utils']
    },
    plugins: [],
    externals: [new webpack.ExternalsPlugin('commonjs2', ['electron'])]
};

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    include: /app/,
    loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!',
        'sass-loader?sourceMap'
    ]
});


webpackConfig.sassLoader = {
    includePaths: [path.join(__dirname, 'app')]
};


// File Loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]' },
    { test: /\.(png|jpg)$/, loader: 'url-loader' }
);

module.exports = webpackConfig;
