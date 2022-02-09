const { get, post, context } = require('@frenchpastries/assemble')
const {
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const projectHandler = request => {
  if (request.context.id === 'all') return listProjectByOwnerHandler(request)
  return getProjectHandler(request)
}

const projectContext = context('/project', [
  get('/:id', guardAuth(projectHandler)),
  post('/create', guardAuth(createOrUpdateProjectHandler)),
  post('/update', guardAuth(createOrUpdateProjectHandler)),
])

module.exports = {
  projectContext,
}
