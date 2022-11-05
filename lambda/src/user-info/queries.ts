import { log } from '../utils/logger'
import { UserInfo } from './types'

export const selectById = (id: string) => {
  return { text: 'SELECT * FROM user_info WHERE id = $1', values: [id] }
}

export const updateOrInsert = ({
  exist,
  id,
  info,
}: {
  exist: boolean
  id: string
  info: UserInfo
}) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE user_info SET info = $2 WHERE id = $1 RETURNING id, info',
      values: [id, info],
    }
  } else {
    log('create', { id, info })
    if (id) {
      return {
        text: 'INSERT INTO user_info (id, info) VALUES ($1, $2) RETURNING id, info',
        values: [id, info],
      }
    } else {
      return {
        text: 'INSERT INTO user_info (info) VALUES ($1) RETURNING id, info',
        values: [info],
      }
    }
  }
}
