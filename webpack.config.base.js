import path from 'path';
import webpack from 'webpack';

export default {
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: [
            ['import', { libraryName: 'antd', style: true }],
          ],
        }
      }]
    }],
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname, 'main'),
      path.resolve(__dirname, 'app'),
      path.resolve(__dirname, 'app/shared-components'),
      'node_modules',
    ],
    alias: {
      joi: 'joi-browser',
    },
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
  node: {
    fs: 'empty',
    net: false,
    tls: false
  },
};
