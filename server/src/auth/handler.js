const { log } = require('../utils/logger')
const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const jwt = require('jsonwebtoken')

const check = bearer =>
  new Promise((resolve, reject) => {
    log('check ', bearer)
    jwt.verify(
      bearer,
      process.env.AUTH0_PUBLIC_KEY,
      {
        algorithms: ['RS256'],
      },
      (err, decoded) => (err ? reject(err) : resolve(decoded))
    )
  })
const loginHandler = async request =>
  check(request.headers.authorization.replace(/^Bearer\s+/, ''))
    .then(res => response(res))
    .catch(forbidden)

module.exports = { loginHandler }
