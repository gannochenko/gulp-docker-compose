const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
    // inform webpack we are building for nodejs
    target: 'node',

    // the name of the root file
    entry: './src/index.js',

    // where to put the output bundle
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2',
    },

    externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, config);
