const { get, post, context } = require('@frenchpastries/assemble')
const {
  createOrUpdateUserInfoHandler,
  getUserInfoHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const userInfoContext = context('/user-info', [
  get('/', guardAuth(getUserInfoHandler)),
  post('/create', guardAuth(createOrUpdateUserInfoHandler)),
  post('/update', guardAuth(createOrUpdateUserInfoHandler)),
])

module.exports = {
  userInfoContext,
}
