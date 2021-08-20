const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ROOT_PATH = path.resolve(__dirname)
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist')
const packageinfo = require('./package.json').version
const TerserPlugin = require('terser-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    mode: 'production',//设置生产环境构建
    entry: {
      /* eslint-disable-next-line quote-props */
      'ispeak-bber-md': './src/js/main-md.js',
      'ispeak-bber': './src/js/main.js'
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    output: {
      path: BUILD_PATH,
      filename: '[name].min.js',
      library: 'ispeakBber',
      libraryTarget: 'umd'
    },
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-modules-commonjs',
              '@babel/transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  target: ['web', 'es5'],
  plugins: [
    new webpack.BannerPlugin(`package version: ${packageinfo}`),
    new CopyPlugin({
      patterns: [{ from: 'demo/', to: './' }]
    }),
    new VueLoaderPlugin(),
    new TerserPlugin({
      parallel: 4,
      terserOptions: {
        ecma: 5,
        toplevel: true,
        ie8: true,
        safari10: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ],
  devServer: {
    static: [
      {
        directory: BUILD_PATH,
        publicPath: '/dist/',
        serveIndex: true,
        watch: true
      }
    ],
    port: 9820,
    host: 'localhost',
    open: true,
    hot: true,
    compress: true
  },
  performance: {
    maxEntrypointSize: 524288,
    maxAssetSize: 524288
  }
}
