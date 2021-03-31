const { get, post, context } = require('@frenchpastries/assemble')
const {
  listWorkTimeByProjectHandler,
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const workedTimeContext = context('/worked-time', [
  get('/', guardAuth(getWorkTimeHandler)),
  get('/all', guardAuth(listWorkTimeHandler)),
  get('/project', guardAuth(listWorkTimeByProjectHandler)),
  post('/create', guardAuth(createOrUpdateWorkTimeHandler)),
  post('/update', guardAuth(createOrUpdateWorkTimeHandler)),
])

module.exports = {
  workedTimeContext,
}
