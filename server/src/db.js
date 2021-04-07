const { Client } = require('pg')

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
})

const connect = async () =>
  client
    .connect()
    .then(() => console.log('Postgres: Connection success'))
    .catch(err => {
      const add = err.address + ':' + err.port
      const msg = `Postgres: Connection refused to ${add}`
      console.error(msg)
    })

const end = async () => {
  await client.end()
}

const query = (...args) => client.qery(args)

module.exports = { client, connect, end, query }
