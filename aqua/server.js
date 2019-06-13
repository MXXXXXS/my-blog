const express = require(`express`)
const app = express()
const bodyParser = require(`body-parser`)

const router = require(`./routers/router`)
const paths = require(`./config/paths`)

app.use(bodyParser.json())

app.use(`/`, express.static(paths.dirs.pages.home))
app.use(`/login`, express.static(paths.dirs.pages.login))
app.use(`/editor`, express.static(paths.dirs.pages.editor))
app.use(`/welcome`, express.static(paths.dirs.pages.welcome))
app.use(`/images`, express.static(paths.dirs.assets.images))
app.use(`/welcome/images`, express.static(paths.dirs.assets.images))

app.get(`/articles`, router.articles.GET)
app.get(`/article/*`, router.article.GET)
app.get(`/comments`, router.comments.GET)

app.post(`/login`, router.login.POST)
app.post(`/article/*`, router.article.POST)
app.post(`/comments`, router.comments.POST)

app.listen(80, () => {
  const host = `127.0.0.1`
  const port = 80

  console.log(`Listening at http://${host}:${port}`)
})