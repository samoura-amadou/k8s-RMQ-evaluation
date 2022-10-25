import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { log } from './utils/logger'
import handler, { origin } from './handler'

export const main = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  event.location = new URL(event.path, origin())
  if (!event.method) event.method = event.requestContext.http.method
  const res = await handler(event)
  log(JSON.stringify(res))
  res.multiValueHeaders = {
    'Access-Control-Allow-Origin': res.headers['Access-Control-Allow-Origin'],
  }
  delete res.headers['Access-Control-Allow-Origin']
  return res
}
