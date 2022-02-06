if (process.env.NODE_ENV != 'prod') require('dotenv').config()
const MilleFeuille = require('@frenchpastries/millefeuille')
const { response } = require('@frenchpastries/millefeuille/response')
const Arrange = require('@frenchpastries/arrange')
const { get, notFound, context, routes } = require('@frenchpastries/assemble')
const { connect } = require('./db')
const { projectContext } = require('./project')
const { workedTimeContext } = require('./workedTime')
const { userInfoContext } = require('./user-info')
const { parseAuth } = require('./middleware/auth')
const { log } = require('./utils/logger')

connect()

const handler = routes([
  get('/', () => response('ok')),
  context('/time', [
    get('/', () => response(handler.exportRoutes())),
    projectContext,
    workedTimeContext,
    userInfoContext,
  ]),
  notFound(() => ({ statusCode: 404 })),
])

const origin = () => {
  log(process.env.FRONT_HOSTNAME)
  if (process.env.FRONT_HOSTNAME) {
    return process.env.FRONT_HOSTNAME
  } else {
    return 'http://localhost:3000'
  }
}

const withJSONIn = Arrange.json.parse(handler)
const withJSONOut = Arrange.json.response(withJSONIn)
const withAuth = parseAuth(withJSONOut)
const withCors = Arrange.cors.origin(withAuth, origin())
MilleFeuille.create(withCors, { port: process.env.PORT })
log('-----> Server up and running at port ' + process.env.PORT)
