import merge from 'webpack-merge';
import prodConf from '../webpack.config.production';
import path from 'path';


export default merge(prodConf, {
  devtool: 'none',
  entry: [path.join(__dirname, 'index.js')],

  output: {
    path: path.join(__dirname, 'dist'),
  },
});