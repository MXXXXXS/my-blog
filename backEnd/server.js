const path = require('path')
const fs = require('fs')
const assert = require('assert')
const MongoClient = require('mongodb').MongoClient
const md = require('markdown-it')()
const express = require('express')
const app = express()
const JWT = require('jsonwebtoken')
const formidable = require('formidable')
const rootDir = path.resolve(__dirname, '../')
const articleDir = rootDir + '/articles/'
const frontEndDir = rootDir + '/frontEnd'
const imagesDir = rootDir + '/images'
const editor = rootDir + '/frontEnd/MDEditer.html'
const adminKey = 'mxxxxxs'
const readFile = file => {
  return new Promise((res, rej) => {
    fs.readFile(file, (err, data) => {
      if (err) return rej(err)
      res(data)
    })
  })
}
const verifyToken = (token, secret) => {
  return new Promise((res, rej) => {
    JWT.verify(token, secret, (err, decoded) => {
      if (err) {
        rej(err)
      } else {
        res(decoded)
      }
    })

  })
}
//<定义文章结构>
class Article {
  constructor(...options) {
    this.name = options[0]
    this.content = options[1]
    this.comment = options[2]
    this.info = options[3]
  }
}
new Article('第一篇存在数据库里的文章', 'Hello world?', '没有评论', {})
//</定义文章结构>
//<连接数据库>
// const dbUrl = 'mongodb://localhost:27017'
// const dbName = 'cliPage'
// MongoClient.connect(dbUrl, (err, client) => {
//   assert.strictEqual(null, err, 'X连接数据库失败')
//   console.log('√连接到数据库成功')
//   const db = client.db(dbName)
//   findInDb({}, db, () => {
//     client.close()
//   })
// })
// function insert2db(item, db, cb) {
//   const collection = db.collection('articles')
//   collection.insertMany([item],
//     (err, result) => {
//       assert.strictEqual(err, null)
//       assert.strictEqual(1, result.result.n)
//       assert.strictEqual(1, result.ops.length)
//       console.log('√添加了一篇文章到数据库里')
//       cb(result)
//     })
// }
// function findInDb(condition, db, cb) {
//   const collection = db.collection('articles')
//   collection.find(condition).toArray((err, articles) => {
//     assert.strictEqual(err, null)
//     console.log('找到了这些:')
//     console.log(articles)
//     cb(articles)
//   })
// }
//</连接数据库>
//<token生成>
function gToken(uid, secret) {
  return JWT.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    administrator: uid,
    secret: secret
  }, secret)
}
//</token生成>
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
//<登录处理>
app.post('/login', (rq, rs) => {
  let form = new formidable.IncomingForm()
  form.parse(rq, (err, fields) => {
    if (err) rs.send('Failed')
    let token = gToken(fields.name, fields.password)
    rs.setHeader('Content-Type', 'text/plain')
    rs.send(token)
    console.log('received user: ' + fields.name + '    ' + fields.password)
  })
})
//</登录处理>
app.get('/editor', async (rq, rs) => {
  let page = await readFile(editor)
  rs.setHeader('Content-Type', 'text/html')
  rs.send(page)
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

app.post('/addArticle', async (rq, rs) => {
  try {
    console.log(JSON.stringify(rq.headers.jwt));

    let result = await verifyToken(rq.headers.jwt, adminKey)
    if (!result) rs.send('Authorize Failed')
    rs.send('Successed')
    let form = new formidable.IncomingForm()
    form.parse(rq, (err, fields, files) => {
      if (err) throw err
      console.log(JSON.stringify(fields) + '\n' +JSON.stringify(files))

      fs.appendFile(path.resolve(__dirname, '../articles/' + fields.title + '.md'), fields.content, (err) => {
        if(err) throw err
      })

    })
  } catch (err) {
    console.log(err)
    rs.send('Failed')
  }

})

app.use(express.static(frontEndDir))
app.use('/images', express.static(imagesDir))


//<开启服务器>
const server = app.listen(80, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
//</开启服务器>