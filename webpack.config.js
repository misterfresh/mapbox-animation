var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.join(__dirname, 'node_modules');
var devFlagPlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

var config = {
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://127.0.0.1:3000',
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'assets/js'),
        filename: 'bundle.js',
        publicPath: 'http://127.0.0.1:3000/static/'
    },
    debug: true,
    node: {
        console: true,
        fs: 'empty'
    },
    devtool: 'eval',
    plugins: [
        new webpack.NoErrorsPlugin(),
        devFlagPlugin
    ],
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            {
                loaders: ["babel-loader?plugins[]=transform-runtime&presets[]=es2015&presets[]=stage-0&presets[]=react"],
                test: /\.js$/,
                include: __dirname,
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
                loader: 'worker'
            }
        ]
    },
    resolve: {
        root: __dirname,
        alias: {
            deps: 'deps',
            mapbox: 'js',
            shaders: 'shaders',
            src: 'src',
            utils: 'utils',
            webworkify: 'webworkify-webpack'
        },
        extensions: ['', '.js']
    }
};

module.exports = config;