const path = require(`path`)
const fs = require(`fs`)

const formidable = require(`formidable`)
const JWT = require(`jsonwebtoken`)
const MarkdownIt = require(`markdown-it`)
const md = new MarkdownIt()

const paths = require(`../config/paths`)
const me = require(`../config/me`)

module.exports = {
  GET: (req, res) => {
    const article = decodeURI(path.basename(req.path))
    console.log(article)
    fs.readFile(path.resolve(paths.dirs.articles, article), (err, data) => {
      if (err) {
        res.send(`emmmm, 可能没有一篇叫"${article.slice(0, -3)}"的文章`)
        return
      }
      let result = md.render(data.toString())
      res.send(result)
    })
  },
  POST: async (req, res) => {
    const imgHash = /[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/
    const article = decodeURI(path.basename(req.path))
    const decoded = await new Promise((res, rej) => {
      JWT.verify(req.headers.jwt, me.password, (err, decoded) => {
        if (err) {
          rej(err)
        } else {
          res(decoded)
        }
      })
    }).catch(err => {
      console.error(`Illegal token: ${err}`)
    })
    if (decoded) {
      const form = new formidable.IncomingForm()
      form.uploadDir = paths.dirs.articles
      form.keepExtensions = true
      form.parse(req, (err, fields, files) => {
        if (err) throw err
        console.log(JSON.stringify(fields) + `\n` + JSON.stringify(files))
        //图片改名
        for (const key in files) {
          const hash = key.match(imgHash)
          if (files.hasOwnProperty(key)) {
            const pic = files[key]
            fs.rename(pic.path, path.join(paths.dirs.images, hash[0].slice(0, 5) + `_` + pic.name), err => {
              if (err) console.error(`Image renamed failed: ${err}`)
            })
          }
        }
        //文章内的连接地址修改
        const objectURLNameMap = JSON.parse(fields.objectURLNameMap)
        for (const key in objectURLNameMap) {
          if (objectURLNameMap.hasOwnProperty(key)) {
            const hash = key.match(imgHash)
            fields.content = fields.content.replace(key,`../images/` + hash[0].slice(0, 5) + `_` + objectURLNameMap[key])
          }
        }
        //文章存储
        fs.writeFile(path.resolve(paths.dirs.articles, article + `.md`), fields.content, err => {
          if (err) {
            res.status(403).send(`Artcile saved failed: ${err}`)
          } else {
            res.status(201).send(`Article saved`)
          }
        })
      })
    } else {
      res.status(401).send(`Authorize Failed`)
    }
  }
}