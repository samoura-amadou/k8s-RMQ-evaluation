import { get, post, context } from '@frenchpastries/assemble'
import {
  createOrUpdateTenantHandler,
  getTenantHandler,
  listTenantByOwnerHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

const tenantHandler = (request: any) => {
  if (request.context.id === 'all') return listTenantByOwnerHandler(request)
  return getTenantHandler(request)
}

export const tenantContext = context('/tenant', [
  get('/:id', guardAuth(tenantHandler)),
  post('/create', guardAuth(createOrUpdateTenantHandler)),
  post('/update', guardAuth(createOrUpdateTenantHandler)),
])
