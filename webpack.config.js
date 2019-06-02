const VueLoaderPlugin = require(`vue-loader/lib/plugin`)
const path = require(`path`)

module.exports = {
  mode: `development`,
  entry: {
    "editor/dist/MDEditor": path.resolve(__dirname, `aqua/pages/editor/MDEditor.js`),
    "welcome/dist/index": path.resolve(__dirname, `aqua/pages/welcome/index.js`)
  },
  output: {
    path: path.resolve(__dirname, `aqua/pages`),
    filename: `[name].js`
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: `vue-loader`
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: `babel-loader`
    },
    {
      test: /\.css$/,
      use: [
        `vue-style-loader`,
        `css-loader`
      ]
    }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue': `vue/dist/vue.js`
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, `aqua`),
    port: 80
  }
}