const fs = require(`fs`)
const path = require(`path`)

const paths = require(`../config/paths`)

module.exports = {
  GET: (req, res) => {
    fs.readdir(paths.dirs.articles, (err, files) => {
      if (err) {
        res.status(404).send(`读取文章列表居然失败了? 参考错误: ${err}`)
        return
      }
      files = files.map(file => path.basename(file, `.md`))
      res.send(JSON.stringify(files))
    })
  }
}