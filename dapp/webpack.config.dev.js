import merge from 'webpack-merge';
import devConf from '../webpack.config.development';
import path from 'path';

const port = process.env.PORT || 3000;
const publicPath = `http://localhost:${port}/dist`;

export default merge(devConf, {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?https://localhost:${port}/`,
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'index.js'),
  ],

  output: {
    publicPath: `https://localhost:${port}/dist/`,
    sourceMapFilename: './bundle.js.map',
    path: path.resolve(__dirname, 'dist'),
    pathinfo: true,
    filename: '[name].bundle.js',
    chunkFilename: '[name].[hash].[id].js',
  },
  target: 'web',
  devServer: {
    port,
    hot: true,
    inline: false,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    https: true,
    publicPath,
  },
});