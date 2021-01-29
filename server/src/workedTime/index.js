const { get, post, context } = require('@frenchpastries/assemble')
const {
  listWorkTimeByProjectHandler,
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
} = require('./handlers')

const workedTimeContext = context('/worked-time', [
  get('/', getWorkTimeHandler),
  get('/all', listWorkTimeHandler),
  get('/project', listWorkTimeByProjectHandler),
  post('/create', createOrUpdateWorkTimeHandler),
  post('/update', createOrUpdateWorkTimeHandler),
])

module.exports = {
  workedTimeContext,
}
