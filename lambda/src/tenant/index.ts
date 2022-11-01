import { get, post, patch, context } from '@frenchpastries/assemble'
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

export const tenantContext = context('/tenant', guardAuth, [
  get('/:id', tenantHandler),
  post('/create', createOrUpdateTenantHandler),
  patch('/update', createOrUpdateTenantHandler),
])
