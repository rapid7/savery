const path = require('path');
const webpack = require('webpack');

const fileName = process.env.SAVERY === 'full' ? 'savery-full' : 'savery';

module.exports = {
  cache: true,

  debug: true,

  devtool: 'source-map',

  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: require('eslint-friendly-formatter')
  },

  module: {
    preLoaders: [
      {
        cacheable: true,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        cacheable: true,
        loader: 'json',
        test: /\.json$/
      }, {
        cacheable: true,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: [
            'syntax-flow',
            'transform-flow-strip-types',
            'add-module-exports'
          ],
          presets: [
            ['latest', {
              'loose': true
            }],
            'stage-2'
          ]
        },
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: `${fileName}.js`,
    library: 'savery',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'SAVERY'
    ])
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join(__dirname, 'src')
    ],

    root: __dirname
  }
};
