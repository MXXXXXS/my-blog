const fs = require(`fs`)
const path = require(`path`)

const paths = require(`../config/paths`)

module.exports = {
  GET: (req, res) => {
    fs.readdir(path.join(paths.dirs.assets.articles), (err, files) => {
      if (err) {
        res.status(404).send(`读取文章列表居然失败了? 参考错误: ${err}`)
      } else {
        //.gitignore is used to keep the folder with no content
        files = files.map(file => path.basename(file, `.md`)).filter(article => article !== `.gitignore` && article !== `images`)
        res.send(JSON.stringify(files))
      }
    })
  }
}