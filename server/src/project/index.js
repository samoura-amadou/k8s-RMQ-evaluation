const { get, post, context } = require('@frenchpastries/assemble')
const {
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const projectContext = context('/project', [
  get('/', guardAuth(getProjectHandler)),
  get('/all', guardAuth(listProjectByOwnerHandler)),
  post('/create', guardAuth(createOrUpdateProjectHandler)),
  post('/update', guardAuth(createOrUpdateProjectHandler)),
])

module.exports = {
  projectContext,
}
