import path from 'path';
import webpack from 'webpack';

export default {
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },

    output: {
        path: path.join(__dirname, 'app'),
        filename: 'bundle.js',
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            path.join(__dirname, 'app'),
            path.join(__dirname, 'app/shared-components'),
            'node_modules',
        ],
        alias: {
            joi: 'joi-browser'
        }
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
    ],

};