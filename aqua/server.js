const express = require(`express`)
const app = express()
const bodyParser = require(`body-parser`)

const index = require(`./routers/index`)
const paths = require(`./config/paths`)

app.use(bodyParser.json())
app.use(`/`, express.static(paths.dirs.home))
app.use(`/login`, express.static(paths.dirs.login))
app.use(`/editor`, express.static(paths.dirs.editor))
app.use(`/welcome`, express.static(paths.dirs.welcome))

app.get(`/article/*`, index.article.GET)
app.get(`/articles`, index.articles.GET)
app.get(`/comments`, index.comments.GET)

app.post(`/login`, index.login.POST)
app.post(`/article/*`, index.article.POST)
app.post(`/comments`, index.comments.POST)

//amd yes

const server = app.listen(80, () => {
  const host = `127.0.0.1`
  const port = 80

  console.log(`Listening at http://%s:%s`, host, port)
})