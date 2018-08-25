const express = require('express')
const path = require('path')
const app = express()

// app.get('/', (rq, rs) => {
//   rs.send('hello world!')
// })

app.get('/article/*', (rq, rs) => {
  let article = path.basename(rq.path)
  console.log(article)
  rs.send('received article name: ' + article)
})

app.use(express.static('../frondEnd'))
// app.use(express.static('../images'))


const server = app.listen(80, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})