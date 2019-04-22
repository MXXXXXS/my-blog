const path = require(`path`)
const fs = require(`fs`)

const formidable = require(`formidable`)
const JWT = require(`jsonwebtoken`)
const MarkdownIt = require(`markdown-it`)
const md = new MarkdownIt()

const paths = require(`../config/paths`)
const me = require(`../config/me`)

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

module.exports = {
  GET: (req, res) => {
    const article = decodeURI(path.basename(req.path))
    console.log(article)
    fs.readFile(path.resolve(paths.dirs.articles, article), (err, data) => {
      if (err) {
        res.send(`emmmm, 可能没有一篇叫"${article}"的文章. 参考错误: ${err}`)
        return
      }
      let result = md.render(data.toString())
      res.send(result)
    })
  },
  POST: async (req, res) => {
    const article = decodeURI(path.basename(req.path))
    const decoded = await verifyToken(req.headers.jwt, me.password)
    if (decoded) {
      res.send(`Authorize successed`)
      const form = new formidable.IncomingForm()
      form.uploadDir = paths.dirs.articles
      form.keepExtensions = true
      form.parse(req, (err, fields, files) => {
        if (err) throw err
        console.log(JSON.stringify(fields) + `\n` + JSON.stringify(files))

        for (const key in files) {
          const hash = key.match(/[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/)
          if (files.hasOwnProperty(key)) {
            const pic = files[key]
            fs.rename(pic.path, path.resolve(paths.dirs.images, hash[0] + `_` + pic.name), err => {
              if (err) throw err
            })
          }
        }

        const objectURLNameMap = JSON.parse(fields.objectURLNameMap)
        for (const key in objectURLNameMap) {
          if (objectURLNameMap.hasOwnProperty(key)) {
            const hash = key.match(/[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/)
            fields.content = fields.content.replace(key, paths.dirs.images + hash[0] + `_` + objectURLNameMap[key])
          }
        }

        fs.appendFile(path.resolve(paths.dirs.articles, article + `.md`), fields.content, err => {
          if (err) throw err
        })

      })
    } else {
      res.send(`Authorize Failed`)
    }
  }
}