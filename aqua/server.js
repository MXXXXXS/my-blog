const express = require(`express`)
const app = express()

const index = require(`./routers/index`)
const paths = require(`./config/paths`)

app.get(`/article/*`, index.article.GET)
app.get(`/articles`, index.articles.GET)

app.post(`/login`, index.login.POST)
app.post(`/article/*`, index.article.POST)

app.use(`/`, express.static(paths.dirs.home))
app.use(`/images`, express.static(paths.dirs.images))
app.use(`/login`, express.static(paths.dirs.login))
app.use(`/editor`, express.static(paths.dirs.editor))
app.use(`/welcome`, express.static(paths.dirs.welcome))

const server = app.listen(80, () => {
  const host = `192.168.3.102`
  const port = 80

  console.log(`Listening at http://%s:%s`, host, port)
})