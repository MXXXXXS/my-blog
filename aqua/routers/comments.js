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
    if (target && article) {
      if (target != article) {
        await db.collection(article).findOneAndUpdate({ id: target }, {
          $push: {
            subComments: {
              id: new Randexp(/\w{5}/).gen(),
              content: content
            }
          },
          $inc: {
            subLength: 1
          }
        })
          .catch(err => {
            console.error(`评论添加失败: ${err}`)
            res.status(500).send(`评论添加失败: ${err}`)
          })
      } else {
        await db.collection(article).insertOne({
          id: new Randexp(/\w{5}/).gen(),
          content: content,
          subLength: 0,
          subComments: []
        })
          .catch(err => {
            console.error(`评论添加失败: ${err}`)
            res.status(500).send(`评论添加失败: ${err}`)
          })
      }
    }
    res.status(201).send(`已添加评论`)
  },
  GET: async (req, res) => {
    const maxLimit = 5
    const target = req.query.target
    const article = req.query.article
    const offset = parseInt(req.query.offset)
    console.log(target, article, offset)
    const client = await require(`../utils/db`).catch(err => console.err(err))
    const db = await client.db(`aqua`)
    if (target && article && offset !== undefined) {
      if (target === article) {
        const commentsLen = await db.collection(article).count()
        const comments = await db.collection(article).find({}, {
          limit: maxLimit,
          skip: offset
        })
          .toArray()
          .catch(err => {
            console.error(`评论获取失败: ${err}`)
          })
        console.log(comments)
        let finished = true
        if (offset + maxLimit < commentsLen) {
          finished = false
        }
        res.status(200).send(JSON.stringify({
          finished: finished,
          comments: comments.map(c => ({
            id: c.id,
            content: c.content,
            subComments: c.subComments
          }))
        }))
      } else {
        const comments = await db.collection(article).findOne({ id: target }, {
          projection: { subComments: { $slice: [offset, maxLimit] } }
        })
        console.log(comments)
        let finished = true
        if (offset + maxLimit < comments.subLength) {
          finished = false
        }
        res.status(200).send(JSON.stringify({
          finished: finished,
          comments: comments.subComments
        }))
      }
    }

  }
}