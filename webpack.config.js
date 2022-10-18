const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");


// =====================================================================

const entryPoint = "./src/index.js";
const htmlTemplate = "./src/index.html";

const targetFolder = "prod-part-2";
const targetImagesFolder = "assets";

// =====================================================================

const isDevMode = process.env.NODE_ENV === "development";
const isProdMode = !isDevMode;

function fileName(ext = "[ext]") {
  return isDevMode ? `[name]${ext}` : `[name]-[contenthash:10]${ext}`;
}

function generateSourceMap() {
  return isDevMode ? "inline-source-map" : false;
}

function optimizationOptions(prodMode) {
  return {
    minimize: prodMode,
    minimizer: [
      "...",
      new CssMinimizerWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
        },
      }),
    ],
  };
}

function cssLoaders(moreLoaders = null) {
  const loaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
  ];

  if (moreLoaders) loaders.push(moreLoaders);
  return loaders;
}

function jsLoaders() {
  return {
    loader: "esbuild-loader",
    options: { target: "es2015" },
  };
}

function devServerOptions() {
  return {
    static: { directory: path.resolve(__dirname, targetFolder), watch: true },
    client: { logging: "error", overlay: false },
    open: { app: { name: "Google Chrome" } },
    historyApiFallback: true,
  };
}

// =====================================================================

module.exports = {
  entry: { bundle: entryPoint },
  output: {
    filename: `script/${fileName(".js")}`,
    path: path.resolve(__dirname, targetFolder),
    clean: isProdMode,
  },

  devtool: generateSourceMap(),
  optimization: optimizationOptions(isProdMode),
  devServer: devServerOptions(),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.scss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(webp|jpg|jpeg|png|svg|ico)$/,
        type: "asset/resource",
        generator: { filename: `${targetImagesFolder}/${fileName()}` },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: htmlTemplate }),
    new MiniCssExtractPlugin({ filename: `css/${fileName(".css")}` }),
  ],
};
