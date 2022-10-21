const { get, post, context } = require('@frenchpastries/assemble')
const {
  createOrUpdateTenantHandler,
  getTenantHandler,
  listTenantByOwnerHandler,
} = require('./handlers')
const { guardAuth } = require('../middleware/auth')

const tenantHandler = request => {
  if (request.context.id === 'all') return listTenantByOwnerHandler(request)
  return getTenantHandler(request)
}

const tenantContext = context('/tenant', [
  get('/:id', guardAuth(tenantHandler)),
  post('/create', guardAuth(createOrUpdateTenantHandler)),
  post('/update', guardAuth(createOrUpdateTenantHandler)),
])

module.exports = {
  tenantContext,
}
