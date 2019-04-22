const VueLoaderPlugin = require(`vue-loader/lib/plugin`)
const path = require(`path`)

module.exports = {
  mode: `development`,
  entry: path.resolve(__dirname, `aqua/assets/pages/editor/MDEditor.js`),
  output: {
    path: path.resolve(__dirname, `aqua/assets/pages/editor/dist`),
    filename: `MDEditor.js`
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
  }
}