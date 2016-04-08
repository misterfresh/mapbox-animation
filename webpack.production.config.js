var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
    entry: [
        'babel-polyfill',
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'assets/js'),
        filename: 'bundle.min.js'
    },
    module: {
        loaders: [
            {
                loaders: ["babel-loader?plugins=transform-runtime&presets[]=es2015&presets[]=stage-0&presets[]=react"],
                test: /\.js$/,
                include: __dirname
            },
            { test: /\.json$/, loader: 'json' },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
                loader: 'worker'
            }
        ]
    },
    node: {
        console: true,
        fs: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    //debug: false,
    resolve: {
        root: __dirname,
        alias: {
            js: 'js',
            shaders: 'shaders',
            src: 'src',
            webworkify: 'webworkify-webpack',
            utils: 'utils'
        },
        extensions: ['', '.js']
    }
};

module.exports = config;