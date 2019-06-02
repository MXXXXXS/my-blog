(async function () {
  const client = await require(`../utils/db`).catch(err => console.err(err))
  //, deleteOne, updateOne, find
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
  const collections = await client.db(`aqua`).collections()
  console.log(collections.map(c => c.collectionName).includs())
  // client.db.collections()
  //   .then(result => console.log(result))
  //   .catch(err => console.err(err))
})()