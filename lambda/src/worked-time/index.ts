import { get, post, context } from '@frenchpastries/assemble'
import {
  listWorkTimeByProjectHandler,
  createWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeHandler,
  historyWorkTimeByProjectHandler,
} from './handlers'
import { guardAuth } from '../middleware/auth'

export const workedTimeContext = context('/worked-time', guardAuth, [
  context('/project/:id', [
    get('/', listWorkTimeByProjectHandler),
    get('/history', historyWorkTimeByProjectHandler),
  ]),
  get('/all', listWorkTimeHandler),
  post('/create', createWorkTimeHandler),
  get('/:id', getWorkTimeHandler),
])
