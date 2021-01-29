const {
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
} = require('./handlers')
const { get, post, context } = require('@frenchpastries/assemble')

const projectContext = context('/project', [
  get('/', getProjectHandler),
  get('/all', listProjectByOwnerHandler),
  post('/create', createOrUpdateProjectHandler),
  post('/update', createOrUpdateProjectHandler),
])

module.exports = {
  projectContext,
}
