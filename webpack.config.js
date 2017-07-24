const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const utils = require('./webpack.config.utils');

const port = {
    web: 82,
    was: 8080
};

const pages = [{
    html: 'index',
    script: 'main',
}, {
    html: 'theres',
    script: 'theres'
}, {
    html: 'sub',
    script: 'sub',
}, {
    html: 'admin/index',
    script: 'admin/main',
}, {
    html: 'admin/there-group',
    script: 'admin/there-group',
}, {
    html: 'admin/there-group-edit',
    script: 'admin/there-group-edit',
}, {
    html: 'admin/there-info',
    script: 'admin/there-info',
}];

module.exports = {
    entry: utils.getEntry(pages),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].[chunkhash].bundle.js'
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, {
                    loader: 'less-loader'
                }]
            }),
            exclude: /node_modules/
        }, {
            test: /\.hbs$/,
            loader: 'handlebars-loader',
            query: {
                helperDirs: path.resolve(__dirname, 'src/template/helpers')
            }
        }]
    },
    devServer: {
        contentBase: './dist',
        port: port.web,
        proxy: {
            '/api': 'http://localhost:' + port.was,
        }
    },
    plugins: utils.getPlugins(pages)
};