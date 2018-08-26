const path = require('path')
const fs = require('fs')
const md = require('markdown-it')()
const express = require('express')
const app = express()
const articleDir = 'D:/coding/AQUAPage/articles/'
const frontEndDir = 'D:/coding/AQUAPage/frontEnd'
const imagesDir = 'D:/coding/AQUAPage/images'

// app.get('/', (rq, rs) => {
//   rs.send('hello world!')
// })

app.get('/article/*', (rq, rs) => {
  let article = path.basename(rq.path)
  console.log(article)
  fs.readFile(articleDir + article, (err, data) => {
    // console.log('../article/' + article)
    if (err) {
      rs.send(`emmmm, 可能没有一篇叫"${article}"的文章. 参考错误: ${err}`)
      return
    }
    console.log(data.toString())

    let result = md.render(data.toString())
    rs.send(result)
    // rs.send('服务器已接受: ' + article)
  })
  // rs.send('received article name: ' + article)
})

app.get('/articleList', (rq, rs) => {
  fs.readdir(articleDir, (err, files) => {
    if (err) {
      rs.send(`!!!, 读取文章列表居然失败了? 参考错误: ${err}`)
      return
    }
    rs.send(JSON.stringify(files))
  })
})

app.use(express.static(frontEndDir))
app.use('/images', express.static(imagesDir))


const server = app.listen(80, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})