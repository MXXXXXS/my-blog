const path = require(`path`)

const pages = path.resolve(__dirname, `../pages`)

module.exports = {
  dirs: {
    assets: {
      articles: path.join(__dirname, `../assets/articles`),
      images: path.join(__dirname, `../assets/articles/images`)
    },
    pages: {
      home: path.join(pages, `home`),
      login: path.join(pages, `login`),
      editor: path.join(pages, `editor/dist`),
      welcome: path.join(pages, `welcome/dist`)
    }
  },
  files: {
    login: path.join(pages, `login/login.html`)
  }
}