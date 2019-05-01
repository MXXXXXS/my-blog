const path = require(`path`)

const pages = path.resolve(__dirname, `../pages`)

module.exports = {
  dirs: {
    home: path.join(pages, `home`),
    login: path.join(pages, `login`),
    editor: path.join(pages, `editor/dist`),
    welcome: path.join(pages, `welcome/dist`)
  },
  files: {
    login: path.join(pages, `pages/login/login.html`)
  }
}