var path = require('path');

module.exports = {
    context: path.resolve(__dirname, '../src'),

    entry: {
        'react-os': './index.js'
    },

    output: {
        path: './dist',
        filename: '[name].js',
        library: 'ReactOS',
        libraryTarget: 'umd'
    },

    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
            {test: /\.scss$/, loaders: ['style', 'css', 'sass']}
        ]
    },

    plugins: [],

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
