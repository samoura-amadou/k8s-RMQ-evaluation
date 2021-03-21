const origin = () => {
  if (process.env.NODE_ENV === 'prod') {
    return process.env.FRONT_HOSTNAME
  } else {
    return 'http://localhost:3000'
  }
}

const headers = {
  'Access-Control-Allow-Origin': origin(),
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': true,
}

const cors = handler => request => {
  if (request.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK',
    }
  } else {
    const response = handler(request)
    return Promise.resolve(response).then(res => ({
      ...res,
      headers: {
        ...res.headers,
        ...headers,
      },
    }))
  }
}

module.exports = {
  cors,
}
