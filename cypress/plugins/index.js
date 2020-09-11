const {Client} = require('pg')
const fs = require('fs')
const path = require('path')

function queryDb(sqlFilename, config) {
  const sqlPath = path.resolve(__dirname, `./../fixtures/${sqlFilename}`)

  if (!fs.existsSync(sqlPath)) {
    return Promise.reject(new Error(`The sql file ${sqlPath} does not exist!`))
  }

  const client = new Client(config.env.db)
  const query = fs.readFileSync(sqlPath, 'utf8')

  client.connect()

  return new Promise((resolve, reject) =>
    client.query(query, (err, res) => {
      if (err) {
        return reject(err)
      }
      client.end()
      return resolve(res)
    })
  )
}

module.exports = (on, config) => {
  on('task', {
    queryDb: query => queryDb(query, config)
  })
}
