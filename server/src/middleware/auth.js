const check = bearer =>
  new Promise((resolve, reject) => {
    log('check ', bearer)
    jwt.verify(
      bearer,
      process.env.AUTH0_PUBLIC_KEY,
      {
        algorithms: ['RS256'],
      },
      (err, decoded) => (err ? reject(err) : resolve(decoded))
    )
  })

const guardAuth = handler => async request => {
  const { headers, services } = request
  const authorization = headers.authorization || ''
  if (authorization.startsWith('Bearer')) {
    return check(request.headers.authorization.replace(/^Bearer\s+/, ''))
      .then(decoded => handler({ ...request, authorized: true, decoded }))
      .catch(err => handler({ ...request, authorized: false }))
  } else {
    return handler({ ...request, authorized: false })
  }
}

module.exports = {
  guardAuth,
}
