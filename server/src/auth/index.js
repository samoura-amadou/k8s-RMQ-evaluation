const fetch = require('node-fetch')
const { get, post, context } = require('@frenchpastries/assemble')
const { log } = require('../utils/logger')
const { loginHandler } = require('./handler')
const { response } = require('@frenchpastries/millefeuille/response')

const routes = context('/auth', [get('/', () => response('ok'))])

module.exports = {
  routes,
}
