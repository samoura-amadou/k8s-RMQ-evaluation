import dotenv from 'dotenv'
dotenv.config()
import MilleFeuille from '@frenchpastries/millefeuille'
import { response } from '@frenchpastries/millefeuille/response'
import Arrange from '@frenchpastries/arrange'
import { get, notFound, context, routes } from '@frenchpastries/assemble'
import { connect } from './db'
import { projectContext } from './project'
import { workedTimeContext } from './workedTime'
import { tenantContext } from './tenant'
import { userInfoContext } from './user-info'
import { parseAuth } from './middleware/auth'
import { log } from './utils/logger'
import { onRequest } from './middleware/logger'
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'

connect()

const handler = routes([
  get('/', () => response('ok')),
  context('/time', [
    get('/routes', () => response(handler.exportRoutes())),
    projectContext,
    workedTimeContext,
    userInfoContext,
    tenantContext,
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
const withCors = Arrange.cors.origin(withJSONOut, origin())
const withLogger = onRequest(withCors)
const withAuth = parseAuth(withLogger)

console.log('--> Routes: ', handler.exportRoutes())

MilleFeuille.create(withAuth, { port: process.env.PORT })

export const main = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  event.location = new URL(event.rawPath, origin())
  if (!event.method) event.method = event.requestContext.http.method
  const res = await withAuth(event)
  log(JSON.stringify(res))
  res.multiValueHeaders = {
    'Access-Control-Allow-Origin': res.headers['Access-Control-Allow-Origin'],
  }
  delete res.headers['Access-Control-Allow-Origin']
  return res
}
