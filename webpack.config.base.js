/* eslint strict: 0 */

'use strict';

const path = require('path');
const cssnano = require('cssnano');
const webpack = require('webpack');

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
    includePaths: path.join(__dirname, 'app')
};


// File Loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'file?name=font/[name].[ext]' },
  { test: /\.woff2(\?.*)?$/, loader: 'file?name=font/[name].[ext]' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?name=font/[name].[ext]' },
  { test: /\.ttf(\?.*)?$/,   loader: 'file?name=font/[name].[ext]' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?name=font/[name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'file?name=font/[name].[ext]' },
  { test: /\.(png|jpg)$/,    loader: 'file?name=images/[name].[ext]' }
);

module.exports = webpackConfig;
