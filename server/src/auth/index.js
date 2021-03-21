const fetch = require('node-fetch')
const { get, post, context } = require('@frenchpastries/assemble')
const { log } = require('../utils/logger')
const { loginHandler } = require('./handler')

const routes = context('/auth', [get('/login', loginHandler)])

module.exports = {
  routes,
}
