const path = require(`path`)

const assets = path.resolve(__dirname, `../assets`)

module.exports = {
  dirs: {
    home: path.join(assets, `pages`, `home`),
    login: path.join(assets, `pages`, `login`),
    editor: path.join(assets, `pages`, `editor/dist`),
    images: path.join(assets, `images`),
    articles: path.join(assets, `articles`),
    welcome: path.join(assets, `pages`, `welcome/dist`)
  },
  files: {
    login: path.join(assets, `pages/login/login.html`)
  }
}