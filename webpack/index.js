var path = require('path'),
webpack = require('webpack'),
yargs = require('yargs'),
ExtractTextPlugin = require("extract-text-webpack-plugin");

var options = yargs
.alias('p', 'optimize-minimize')
.alias('d', 'debug')
.option('port', {
    default: '8080',
    type: 'string'
})
.argv;

var config = {
    context: path.resolve(__dirname, '../src'),

    entry: {
        'react-os': './index.js'
    },

    output: {
        path: './dist',
        filename: options.optimizeMinimize ? '[name].min.js' : '[name].js',
        library: 'ReactOS',
        libraryTarget: 'umd'
    },

    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader")}
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(options.optimizeMinimize ? 'production' : 'development')
            }
        }),
        new ExtractTextPlugin("react-os.css", {
            allChunks: true
        })
    ],

    externals: [
        {
            'react': {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            }
        },
        {
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            }
        }
    ]
};

if (options.optimizeMinimize) {
    config.devtool = 'source-map';
}

module.exports = config;
