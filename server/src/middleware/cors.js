const { log } = require('../utils/logger')

const origin = () => {
  log(process.env.FRONT_HOSTNAME)
  if (process.env.FRONT_HOSTNAME) {
    return process.env.FRONT_HOSTNAME
  } else {
    return 'http://localhost:3000'
  }
}

const headers = {
  'Access-Control-Allow-Origin': origin(),
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': true,
}

const cors = handler => async request => {
  if (request.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' }
  } else {
    const response = handler(request)
    const res = await Promise.resolve(response)
    return { ...res, headers: { ...res.headers, ...headers } }
  }
}

module.exports = {
  cors,
}
