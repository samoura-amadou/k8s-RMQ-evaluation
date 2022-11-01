import { get, post, patch, context } from '@frenchpastries/assemble'
import { createOrUpdateUserInfoHandler, getUserInfoHandler } from './handlers'
import { guardAuth } from '../middleware/auth'

export const userInfoContext = context('/user-info', guardAuth, [
  get('/', getUserInfoHandler),
  post('/create', createOrUpdateUserInfoHandler),
  patch('/update', createOrUpdateUserInfoHandler),
])
