const { log } = require('../utils/logger')
const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const jwt = require('jsonwebtoken')

const check = bearer =>
  new Promise((resolve, reject) => {
    try {
      resolve(
        jwt.verify(bearer, process.env.AUTH0_CLIENT_SECRET, {
          algorithm: 'RS256',
        })
      )
    } catch (err) {
      reject(err)
    }
  })
const loginHandler = async request =>
  check(request.headers.authorization.replace(/^Bearer\s+/, ''))
    .then(() => response('ok'))
    .catch(forbidden)

module.exports = { loginHandler }
