module.exports = {
    // run babel on every file
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        // 'react', // translate jsx
                        'stage-0', // async code
                        ['env', {
                            targets: {
                                browsers: ['last 2 versions'],
                            }
                        }]
                    ]
                }
            }
        ]
    },

    externals : {
        'babel-polyfill': 'babel-polyfill',
    }
};
