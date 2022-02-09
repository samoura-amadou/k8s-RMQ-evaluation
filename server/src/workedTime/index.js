const { get, post, del, context } = require('@frenchpastries/assemble')
const {
  listWorkTimeByProjectHandler,
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
  deleteWorkTimeHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const workedTimeContext = context('/worked-time', [
  get('/', guardAuth(getWorkTimeHandler)),
  get('/all', guardAuth(listWorkTimeHandler)),
  get('/project', guardAuth(listWorkTimeByProjectHandler)),
  post('/create', guardAuth(createOrUpdateWorkTimeHandler)),
  post('/update', guardAuth(createOrUpdateWorkTimeHandler)),
  del('/delete', guardAuth(deleteWorkTimeHandler)),
])

module.exports = {
  workedTimeContext,
}
