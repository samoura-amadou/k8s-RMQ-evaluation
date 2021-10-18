if (process.env.NODE_ENV != 'prod') require('dotenv').config()
const MilleFeuille = require('@frenchpastries/millefeuille')
const { response } = require('@frenchpastries/millefeuille/response')
const Arrange = require('@frenchpastries/arrange')
const {
  get,
  notFound,
  context,
  ...Assemble
} = require('@frenchpastries/assemble')
const { client, connect } = require('./db')
const { projectContext } = require('./project')
const { workedTimeContext } = require('./workedTime')
const { userInfoContext } = require('./user-info')
const { cors } = require('./middleware/cors')
const { parseAuth } = require('./middleware/auth')
const { log } = require('./utils/logger')

connect()

const handler = Assemble.routes([
  get('/', () => response('ok')),
  context('/time', [
    get('/', () => response(handler.exportRoutes())),
    projectContext,
    workedTimeContext,
    userInfoContext,
  ]),
  notFound(() => ({ statusCode: 404 })),
])

const jsonMiddleware = Arrange.jsonBody(
  Arrange.jsonContentType(Arrange.parseJSONBody(handler))
)

MilleFeuille.create(cors(parseAuth(jsonMiddleware)), {
  port: process.env.PORT,
})
console.log('-----> Server up and running at port ' + process.env.PORT)
