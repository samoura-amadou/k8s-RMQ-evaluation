const { Client } = require('pg')
console.log({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
})
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
})

const connect = async () =>
  client
    .connect()
    .then(() => console.log('Postgres: Connection success'))
    .catch(err => {
      console.log(err)
      const add = err.address + ':' + err.port
      const msg = `Postgres: Connection refused to ${err.message}`
      console.error(msg)
    })

const end = async () => {
  await client.end()
}

const query = (...args) => client.qery(args)

module.exports = { client, connect, end, query }
