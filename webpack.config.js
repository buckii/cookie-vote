const path = require('path');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.esm.js' },
    fallback: {
      url: false,
      crypto: false
    }
  },
  stats: {warnings:false},
  plugins: [
    new Dotenv(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    server: 'https',
    compress: true,
    port: 3000,
  },
};