var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

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
    module: {
        loaders: [
            {
              test: /\.js$/,
              loaders: [
                  'babel-loader'
              ]
            },
            {
              test:  /\.json$/,
              loader: 'json-loader'
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader'
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader'
            }
        ]
    },
    plugins: [
    // new webpack.NormalModuleReplacementPlugin("^(react-bootstrap-modal)$", "^(react)$")
    // new webpack.IgnorePlugin(new RegExp("^(react-bootstrap-modal)$"))
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
