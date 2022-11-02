import { log } from '../utils/logger'
import { forbidden } from '@frenchpastries/millefeuille/response'
import jwt from 'jsonwebtoken'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { Handler } from '@frenchpastries/assemble'

const check = (bearer: string) =>
  new Promise((resolve, reject) => {
    const key = process.env.AUTH0_PUBLIC_KEY
    if (!key) return reject(new Error('Undefined Auth0 Public Key'))
    jwt.verify(bearer, key, { algorithms: ['RS256'] }, (err, decoded) =>
      err ? reject(err) : resolve(decoded)
    )
  })

export const parseAuth = <Body, Response>(handler: Handler<Body, Response>) => {
  return async (request: IncomingRequest<Body>) => {
    const { headers } = request
    const authorization = headers.authorization || ''
    if (authorization.startsWith('Bearer')) {
      return check(authorization.replace(/^Bearer\s+/, ''))
        .then((decoded: any) => {
          console.log(decoded)
          const uid = decoded.sub
          request.authorized = true
          request.decoded = decoded
          request.uid = uid
          return handler(request)
        })
        .catch(err => {
          log(err)
          request.authorized = false
          return handler(request)
        })
    } else {
      request.authorized = false
      return handler(request)
    }
  }
}

export const guardAuth = <Body, Response>(handler: Handler<Body, Response>) => {
  return async (request: IncomingRequest<Body>) => {
    if (request.authorized) {
      return handler(request)
    } else {
      return forbidden('Unauthorized')
    }
  }
}
