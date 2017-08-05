const webpack = require('webpack')
const path = require('path')

const config = env => {
  return {
    entry: {
      renderer: './src/renderer/renderer.ts'
    },
    target: 'electron-renderer',
    output: {
      path: path.resolve(__dirname),
      filename: '[name].bundle.js',
      publicPath: '/'
    },
    module: {
      loaders: [
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [
            { loader: 'elm-hot-loader' },
            {
              loader: 'elm-webpack-loader',
              options: env && env.production ? {} : { debug: false, warn: true }
            }
          ]
        },
        { test: /\.ts$/, loader: 'ts-loader' }
      ]
    }
  }
}

module.exports = config
