/* eslint strict: 0 */
'use strict';

const path = require('path');
const cssnano = require('cssnano');

const webpackConfig = {
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, 'app'),
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [

  ],
  externals: [
    'immutable',
    'ipfs-api',
    'material-ui',
    'radium',
    'web3'
  ]
};

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  include: /app/,
  loaders: [
    "style",
    "css?sourceMap",
    "sass?sourceMap"
  ]
});


webpackConfig.sassLoader = {
  includePaths: path.join(__dirname, 'app')
};


// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'file' },
  { test: /\.woff2(\?.*)?$/, loader: 'file' },
  { test: /\.otf(\?.*)?$/,   loader: 'file' },
  { test: /\.ttf(\?.*)?$/,   loader: 'file' },
  { test: /\.eot(\?.*)?$/,   loader: 'file' },
  { test: /\.svg(\?.*)?$/,   loader: 'file' },
  { test: /\.(png|jpg)$/,    loader: 'file' }
);

module.exports = webpackConfig;
