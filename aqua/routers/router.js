const path = require(`path`)
const login = require(`./login`)
const article = require(`./article`)
const articles = require(`./articles`)
const comments = require(`./comments.js`)

module.exports = {
  login: login,
  article: article,
  articles: articles,
  comments: comments
}