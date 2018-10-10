var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeModules = {};


fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports =

{
    // The configuration for the server-side rendering
    name: 'server',
    target: 'node',
    entry: './bin/www',
    output: {
        path: './bin/',
        publicPath: 'bin/',
        filename: 'serverEntryPoint.js'
    },
    externals: nodeModules,
    module: {
        loaders: [
            { test: /\.js$/,

                loaders: [
                    // 'imports?document=this',

                    // 'react-hot',
                    'babel-loader'
                    //,'jsx-loader'
                ]
            },
            { test:  /\.json$/, loader: 'json-loader' },
        ]
    },
    plugins: [
    // new webpack.NormalModuleReplacementPlugin("^(react-bootstrap-modal)$", "^(react)$")
    // new webpack.IgnorePlugin(new RegExp("^(react-bootstrap-modal)$"))
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
