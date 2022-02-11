const { Client } = require('pg')
const { log, error } = require('./utils/logger')

log({
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
  ssl: false,
})

const connect = async () => {
  return client
    .connect()
    .then(() => console.log('Postgres: Connection success'))
    .catch(err => {
      const add = err.address + ':' + err.port
      const msg = `Postgres: Connection refused to ${add}: ${err.message}`
      error(msg)
    })
}

const end = async () => {
  await client.end()
}

const query = (...args) => client.query(args)

module.exports = { client, connect, end, query }
