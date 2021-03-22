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
const { cors } = require('./middleware/cors')
const { guardAuth, parseAuth } = require('./middleware/auth')
const { authContext } = require('./auth')
const { log } = require('./utils/logger')

connect()

const ok = () => response('OK')

const handler = Assemble.routes([
  get('/', ok),
  authContext,
  projectContext,
  workedTimeContext,
  notFound(() => ({ statusCode: 404 })),
])

MilleFeuille.create(
  cors(
    parseAuth(
      guardAuth(
        Arrange.jsonBody(
          Arrange.jsonContentType(Arrange.parseJSONBody(handler))
        )
      )
    )
  ),
  { port: process.env.PORT }
)
console.log('-----> Server up and running at port ' + process.env.PORT)
