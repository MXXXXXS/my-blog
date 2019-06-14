//接收示例
//Files
// {
//   "blob:http://localhost:2335/9500cb18-759a-4d04-ad9e-214459c50d37": {
//     "size": 107670,
//     "path": "",
//     "name": "1.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.554Z"
//   },
//   "blob:http://localhost:2335/d1fa9f1f-6dc5-4339-a496-fc34a6602244": {
//     "size": 75835,
//     "path": "",
//     "name": "2.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.562Z"
//   },
//   "blob:http://localhost:2335/eef87d1b-9072-44e2-b0e7-d9ca5b6b6850": {
//     "size": 100553,
//     "path": "",
//     "name": "3.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.563Z"
//   }
// }
//Fields
//{"info": {title: "test"}, "md":"markdown....."}

const abs2rel = require(`./abs2rel`)

module.exports = function (req, res, mdDir, imgDir, cb) {
  const path = require(`path`)
  const fs = require(`fs`)
  const formidable = require(`formidable`)
  const Randexp = require(`randexp`)
  const imgSrcReg = /blob:.*([a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12})/ //为了验证files是否符合格式

  const prefixReg = /[\w\d]{4}/
  const form = new formidable.IncomingForm()
  form.uploadDir = imgDir
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) throw err
    // console.log(`Fields:` + JSON.stringify(fields) + `Files: ` + JSON.stringify(files))
    let article = fields.md
    let info
    if (fields.info) {
      info = JSON.parse(fields.info)
    } else {
      cb(new Error(`没有info选项`), req, res)
      return
    }
    for (const imgSrc in files) {
      if (files.hasOwnProperty(imgSrc)) {
        if (imgSrcReg.test(imgSrc)) {
          const prefix = new Randexp(prefixReg).gen()
          const img = files[imgSrc]
          //图片改名
          fs.rename(img.path, path.join(imgDir, prefix + `_` + img.name), err => {
            if (err) console.error(`Image renamed failed: ${err}`)
          })
          //文章内的链接地址修改
          const articlePath = path.resolve(mdDir, info.title)
          const imgPath = path.resolve(imgDir, prefix + `_` + img.name)
          console.log(abs2rel(imgPath, articlePath)[0], abs2rel(imgPath, articlePath)[1])
          article = article.replace(imgSrc, abs2rel(articlePath, imgPath)[1])
        } else {
          cb(new Error(`图片改名与文内链接修改失败, 因为files的key格式不是Object URL`), req, res)
          break
        }
      }
    }
    //文章存储
    fs.writeFile(path.join(mdDir, info.title + `.md`), article, err => {
      if (err) {
        res.status(403).send(`Artcile saved failed: ${err}`)
      } else {
        res.status(201).send(`Article saved`)
      }
    })

    cb(null, req, res, info)
  })
}

