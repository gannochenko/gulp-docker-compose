const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
    // the name of the root file
    entry: './src/index.js',

    // where to put the output bundle
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'build')
    },

    resolve: {
        alias: {
            './build/server.js': './build/client.js'
        }
    }
};

module.exports = merge(baseConfig, config);
