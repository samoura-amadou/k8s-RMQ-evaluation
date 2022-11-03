import { get, post, patch, context } from '@frenchpastries/assemble'
import {
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
  addMembersHandler,
  removeMembersHandler,
  getProjectMembers,
  listProjectByOwnerAndMemberHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

const projectHandler = (request: any) => {
  if (request.context.id === 'all') return listProjectByOwnerHandler(request)
  return getProjectHandler(request)
}

export const projectContext = context('/project', guardAuth, [
  get('/', listProjectByOwnerAndMemberHandler),
  get('/owner', listProjectByOwnerHandler),
  context('/:id', [
    get('/', projectHandler),
    context('/members', [
      post('/add', addMembersHandler),
      post('/remove', removeMembersHandler),
      get('/', getProjectMembers),
    ]),
  ]),
  post('/create', createOrUpdateProjectHandler),
  patch('/update', createOrUpdateProjectHandler),
])
