const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleaningOldFiles = require("./plugins/cleaning-cached-files");

module.exports = {
  mode: 'development',
  entry: {
    main: './js/main.js',
    vendor: ['knockout']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
  },
  plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].css',
      }),
      new CleaningOldFiles()
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
              plugins: function() { // postcss plugins, can be exported to postcss.config.js
                return [
                  require('autoprefixer')
                ];
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
      }
    ],
  },
};