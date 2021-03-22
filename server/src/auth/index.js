const fetch = require('node-fetch')
const { get, post, context } = require('@frenchpastries/assemble')
const { log } = require('../utils/logger')
const { loginHandler } = require('./handler')
const { response } = require('@frenchpastries/millefeuille/response')

//for jwt testing purpose, might delete it later idk
const authContext = context('/auth', [
  get('/login', request => {
    log(request.decoded)
    return response('ok')
  }),
])

module.exports = {
  authContext,
}
