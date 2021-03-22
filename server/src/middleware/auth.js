const getUUID = async (token, { authentication }) => {
  const body = JSON.stringify({ token })
  const response = await authentication.checkToken().post({ body })
  const uuid = await response.text()
  return uuid
}

const parseAuthorization = handler => async request => {
  const { headers, services } = request
  const authorization = headers.authorization || ''
  if (authorization.startsWith('Bearer')) {
    const token = authorization.slice(7)
    const authorized = await getUUID(token, services)
    return handler({ ...request, authorized })
  } else {
    return handler({ ...request, authorized: false })
  }
}

module.exports = {
  parseAuthorization,
}
