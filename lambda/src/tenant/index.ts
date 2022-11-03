import { get, post, patch, context } from '@frenchpastries/assemble'
import {
  createOrUpdateTenantHandler,
  getTenantHandler,
  listTenantByOwnerHandler,
  addMembersHandler,
  removeMembersHandler,
  getTenantMembers,
  listTenantByOwnerAndMemberHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

const tenantHandler = (request: any) => {
  if (request.context.id === 'all') return listTenantByOwnerHandler(request)
  return getTenantHandler(request)
}

export const tenantContext = context('/tenant', guardAuth, [
  get('/', listTenantByOwnerAndMemberHandler),
  get('/owner', listTenantByOwnerHandler),
  context('/:id', [
    get('/', tenantHandler),
    context('/members', [
      post('/add', addMembersHandler),
      post('/remove', removeMembersHandler),
      get('/', getTenantMembers),
    ]),
  ]),
  post('/create', createOrUpdateTenantHandler),
  patch('/update', createOrUpdateTenantHandler),
])
