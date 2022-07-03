const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main.js',
    vendor: ['knockout']
  },
  output: {
    filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'public'),
      publicPath: path.resolve(__dirname, 'public'),
      clean: true,
      assetModuleFilename: "[name][ext]",
  },
  optimization: {
    minimize: true,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
          cacheGroups: {
              vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
              },
          },
      }
  },
  plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].css',
      }),
    new HtmlWebpackPlugin({
        title: 'Output Management',
    }),
      new WebpackManifestPlugin({
          basePath: path.resolve(__dirname, 'public')
      })
      ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // Run postcss actions
            options: {
              postcssOptions: {
                plugins: [ // postcss plugins, can be exported to postcss.config.js
                    require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
        },
          {
              test: /\.html$/i,
              use: [
                  {
                      loader: 'html-loader',
                  },
              ],
          },
    ],
    }
}