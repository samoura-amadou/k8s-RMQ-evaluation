import { get, post, patch, context } from '@frenchpastries/assemble'
import {
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

const projectHandler = (request: any) => {
  if (request.context.id === 'all') return listProjectByOwnerHandler(request)
  return getProjectHandler(request)
}

export const projectContext = context('/project', guardAuth, [
  get('/:id', projectHandler),
  post('/create', createOrUpdateProjectHandler),
  patch('/update', createOrUpdateProjectHandler),
])
