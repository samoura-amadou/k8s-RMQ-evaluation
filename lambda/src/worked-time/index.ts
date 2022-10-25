import { get, post, del, context } from '@frenchpastries/assemble'
import {
  listWorkTimeByProjectHandler,
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
  deleteWorkTimeHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

export const workedTimeContext = context('/worked-time', [
  get('/', guardAuth(getWorkTimeHandler)),
  get('/all', guardAuth(listWorkTimeHandler)),
  get('/project', guardAuth(listWorkTimeByProjectHandler)),
  post('/create', guardAuth(createOrUpdateWorkTimeHandler)),
  post('/update', guardAuth(createOrUpdateWorkTimeHandler)),
  del('/delete', guardAuth(deleteWorkTimeHandler)),
])
