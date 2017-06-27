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
            joi: 'joi-browser'
        }
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
    ],
    node: {
        fs: false,
        net: false,
        tls: false
    }
};
