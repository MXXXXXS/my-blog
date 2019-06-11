const Randexp = require(`randexp`)
module.exports = {
  POST: async (req, res) => {
    const target = req.query.target
    const article = req.query.article
    const content = req.body.content
    //评论存数据库
    console.log(target, article, content)
    // db.add(target, content)
    const db = await require(`../utils/db`).catch(err => console.err(err))
    // const db = await client.db(`aqua`)
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
    const db = await require(`../utils/db`).catch(err => console.err(err))
    // const db = await client.db(`aqua`)
    if (target && article && offset !== undefined) {
      //区分文章评论和子评论
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
        console.log(`文章评论获得: ` + comments)
        let finished = true
        if (offset + maxLimit < commentsLen) {
          finished = false
        }

        const reply = {
          finished: true,
          comments: {}
        }
        reply.finished = finished
        comments.forEach(c => {
          reply.comments[c.id] = c.content
        })
        res.status(200).send(JSON.stringify(reply))
      } else {
        const comments = await db.collection(article).findOne({ id: target }, {
          projection: { subComments: { $slice: [offset, maxLimit] } }
        })
        console.log(`子评论获得: ` + comments)
        let finished = true
        if (offset + maxLimit < comments.subLength) {
          finished = false
        }
        const reply = {
          finished: true,
          comments: {}
        }
        reply.finished = finished
        comments.subComments.forEach(c => {
          reply.comments[c.id] = c.content
        })
        res.status(200).send(JSON.stringify(reply))
      }
    }

  }
}