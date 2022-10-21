import { get, post, context } from '@frenchpastries/assemble'
import { createOrUpdateUserInfoHandler, getUserInfoHandler } from './handlers'
import { guardAuth } from '../middleware/auth'

export const userInfoContext = context('/user-info', [
  get('/', guardAuth(getUserInfoHandler)),
  post('/create', guardAuth(createOrUpdateUserInfoHandler)),
  post('/update', guardAuth(createOrUpdateUserInfoHandler)),
])
