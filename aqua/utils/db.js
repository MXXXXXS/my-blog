
//定义文章结构>
class Article {
  constructor(...options) {
    this.name = options[0]
    this.content = options[1]
    this.comment = options[2]
    this.info = options[3]
  }
}
new Article(`第一篇存在数据库里的文章`, `Hello world?`, `没有评论`, {})

const MongoClient = require(`mongodb`).MongoClient

const dbUrl = `mongodb://localhost:27017`
const dbName = `cliPage`
MongoClient.connect(dbUrl, (err, client) => {
  assert.strictEqual(null, err, `X连接数据库失败`)
  console.log(`√连接到数据库成功`)
  const db = client.db(dbName)
  findInDb({}, db, () => {
    client.close()
  })
})
function insert2db(item, db, cb) {
  const collection = db.collection(`articles`)
  collection.insertMany([item],
    (err, result) => {
      assert.strictEqual(err, null)
      assert.strictEqual(1, result.result.n)
      assert.strictEqual(1, result.ops.length)
      console.log(`√添加了一篇文章到数据库里`)
      cb(result)
    })
}
function findInDb(condition, db, cb) {
  const collection = db.collection(`articles`)
  collection.find(condition).toArray((err, articles) => {
    assert.strictEqual(err, null)
    console.log(`找到了这些:`)
    console.log(articles)
    cb(articles)
  })
}