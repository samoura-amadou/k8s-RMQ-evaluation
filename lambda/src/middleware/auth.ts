// @ts-nocheck
import { log } from '../utils/logger'
import { forbidden } from '@frenchpastries/millefeuille/response'
import jwt from 'jsonwebtoken'

const check = (bearer: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      bearer,
      process.env.AUTH0_PUBLIC_KEY,
      { algorithms: ['RS256'] },
      (err, decoded) => (err ? reject(err) : resolve(decoded))
    )
  })

export const parseAuth = handler => async request => {
  const { headers } = request
  const authorization = headers.authorization || ''
  if (authorization.startsWith('Bearer')) {
    return check(authorization.replace(/^Bearer\s+/, ''))
      .then(decoded => {
        const uid = decoded.sub
        return handler({ ...request, authorized: true, decoded, uid })
      })
      .catch(err => {
        log(err)
        return handler({ ...request, authorized: false })
      })
  } else {
    return handler({ ...request, authorized: false })
  }
}

export const guardAuth = handler => async request => {
  if (request.authorized) {
    const result = await handler(request)
    return result
  } else {
    return forbidden('Unauthorized')
  }
}
