import { get, post, del, context } from '@frenchpastries/assemble'
import {
  listWorkTimeByProjectHandler,
  createWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
  deleteWorkTimeHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

export const workedTimeContext = context('/worked-time', guardAuth, [
  get('/project', listWorkTimeByProjectHandler),
  get('/all', listWorkTimeHandler),
  post('/create', createWorkTimeHandler),
  del('/delete', deleteWorkTimeHandler),
  get('/:id', getWorkTimeHandler),
])
