import { response } from '@frenchpastries/millefeuille/response'
import Arrange from '@frenchpastries/arrange'
import { get, notFound, context, routes } from '@frenchpastries/assemble'
import { connect } from './db'
import { projectContext } from './project'
import { workedTimeContext } from './worked-time'
import { tenantContext } from './tenant'
import { userInfoContext } from './user-info'
import { parseAuth } from './middleware/auth'
import { log } from './utils/logger'
import { onRequest } from './middleware/logger'

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

export const origin = () => {
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

export default withAuth
