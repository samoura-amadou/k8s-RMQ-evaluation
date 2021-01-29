require('dotenv').config()
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

connect()

const ok = () => response('OK')

const handler = Assemble.routes([
  get('/', ok),
  projectContext,
  notFound(() => ({ statusCode: 404 })),
])

MilleFeuille.create(
  Arrange.jsonBody(Arrange.jsonContentType(Arrange.parseJSONBody(handler))),
  { port: process.env.PORT }
)
console.log('-----> Server up and running at port ' + process.env.PORT)
