module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    browsers: ['last 2 versions', 'safari >= 7']
                }
            }
        ],
        '@babel/preset-react',
        '@babel/preset-flow'
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-export-namespace-from'
    ],
    env: {
        development: {
            plugins: [
                [
                    'react-intl',
                    {
                        messagesDir: './intl/en',
                        enforceDescriptions: false
                    }
                ]
            ]
        }
    }
};
