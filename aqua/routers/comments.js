const Randexp = require(`randexp`)
module.exports = {
  POST: async (req, res) => {
    const target = req.query.target
    const article = req.query.article
    const content = req.body.content
    //评论存数据库
    console.log(target, article, content)
    // db.add(target, content)
    const client = await require(`../utils/db`).catch(err => console.err(err))
    const db = await client.db(`aqua`)
    if (target) {
      await db.collection(article).findOneAndUpdate({ id: target }, {
        '$push': {
          'subComments': {
            id: new Randexp(/\w{5}/).gen(),
            content: content
          }
        }
      })
        .catch(err => {
          console.error(`子评论添加失败: ${err}`)
        })
    } else {
      await db.collection(article).insertOne({
        id: new Randexp(/\w{5}/).gen(),
        content: content,
        subComments: []
      })
        .catch(err => {
          console.error(`文章评论添加失败: ${err}`)
        })
    }
    res.status(201).send(`Got comment`)
  },
  GET: (req, res) => {
    const target = req.query.target
    const max = req.query.max
    console.log(target, max)
    res.status(200).send(`No comment`)

  }
}