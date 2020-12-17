const webpack = require("webpack");

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        THREE: "three"
      })
    ],
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ["raw-loader", "glslify-loader"]
        }
      ]
    }
  }
};
