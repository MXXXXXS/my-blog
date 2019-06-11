const MongoClient = require(`mongodb`).MongoClient

const url = `mongodb://localhost:27017`
const name = `aqua`
const collection = `comments`
module.exports = (async function () {
  //insertOne, deleteOne, updateOne, find
  async function crud(client, dbName, collection, method, args) {
    let result
    if (method === `find`) {
      result = await client.db(dbName).collection(collection)[method](...args).toArray()
        .catch(err => {
          console.error(err)
        })
    } else {
      result = await client.db(dbName).collection(collection)[method](...args)
        .catch(err => {
          console.error(err)
        })
    }
    console.log(`Succed: ` + JSON.stringify(result))
    return result
  }

  async function linkDB(url) {
    const client = await new MongoClient(url, { useNewUrlParser: true }).connect()
      .catch(err => {
        console.error(`连接服务器失败: ${err}`)
      })
    return await client.db(`aqua`)
  }

  return await linkDB(url)
})()