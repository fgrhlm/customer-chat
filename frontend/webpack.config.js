// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require('webpack');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  // Uncomment för freddes kurs, drar lite onödigt mycket ram o disk space i dev environment
  devtool: "source-map",
  resolve: {
    roots: [path.resolve('./src')],
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    client: path.resolve(__dirname, "./src/client/index.js"),
    admin: path.resolve(__dirname, "./src/admin/index.js")
  },
  output: {
    filename: '[name]/js/bundle.js',
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        {from: "src/index.html", to: "index.html"},
        {from: "src/admin/index.html", to: "admin/index.html"},
        {from: "src/client/index.html", to: "client/index.html"},
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp3)$/i,
        loader: "file-loader",
        options: {
          outputPath: "frontend/assets/"
        }
      }
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
