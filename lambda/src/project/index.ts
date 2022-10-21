import { get, post, context } from '@frenchpastries/assemble'
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

export const projectContext = context('/project', [
  get('/:id', guardAuth(projectHandler)),
  post('/create', guardAuth(createOrUpdateProjectHandler)),
  post('/update', guardAuth(createOrUpdateProjectHandler)),
])
