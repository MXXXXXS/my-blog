const formidable = require(`formidable`)
const JWT = require(`jsonwebtoken`)

const me = require(`../config/me`)

module.exports = {
  POST: (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields) => {
      if (err) res.send(`Failed: form parsing`)
      const token = JWT.sign({
        expire: Math.floor(Date.now() / 1000) + 24 * (60 * 60),
        name: me.user
      }, me.password)
      res.setHeader(`Content-Type`, `text/plain`)
      res.send(token)
      console.log(`Some one is logining: ` + fields.name + ` ` + fields.password)
    })
  }
}