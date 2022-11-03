import { log, error } from '../utils/logger'
import { TenantInfo } from './types'

export const selectById = (id: string) => {
  return { text: 'SELECT * FROM tenant WHERE id = $1', values: [id] }
}

export const updateOrInsert = ({
  exist,
  id,
  info,
  owner,
}: {
  exist: boolean
  id: string
  info: TenantInfo
  owner: string
}) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE tenant SET info = $2 WHERE id = $1 RETURNING id',
      values: [id, info],
    }
  } else {
    if (owner) {
      log('create', { id, info })
      if (id) {
        return {
          text: 'INSERT INTO tenant (id, info, owner) VALUES ($1, $2, $3) RETURNING id',
          values: [id, info, owner],
        }
      } else {
        return {
          text: 'INSERT INTO tenant (info, owner) VALUES ($1, $2) RETURNING id',
          values: [info, owner],
        }
      }
    } else {
      error('no owner')
      return null
    }
  }
}

export const listByOwner = ({ owner }: { owner: string }) => {
  log('list', { owner })
  return {
    text: `SELECT
        tenant.id,
        tenant.info,
        tenant.owner,
        tenant.created_at,
        tenant.updated_at,
        tenant.members,
        user_info.info as owner_info
      FROM tenant
      LEFT JOIN user_info ON user_info.id = tenant.owner
      WHERE tenant.owner = $1`,
    values: [owner],
  }
}

export const listByMember = ({ member }: { member: string }) => {
  log('list', { member })
  return {
    text: `SELECT
        tenant.id,
        tenant.info,
        tenant.owner,
        tenant.created_at,
        tenant.updated_at,
        tenant.members,
        user_info.info as owner_info
      FROM tenant
      LEFT JOIN user_info ON user_info.id = tenant.owner
      WHERE tenant.members::jsonb ? $1`,
    values: [member],
  }
}

export const addMembers = ({ id, member }: { id: string; member: string }) => {
  log('add member', { id, member })

  return {
    text: `UPDATE tenant
            SET members = members::jsonb || $2::jsonb
            WHERE id = $1
            RETURNING id, members`,
    values: [id, JSON.stringify([member])],
  }
}

export const removeMembers = ({
  id,
  member,
}: {
  id: string
  member: string
}) => {
  log('remove member', { id, member })

  return {
    text: `UPDATE tenant
            SET members = members::jsonb - $2
            WHERE id = $1
            RETURNING id, members`,
    values: [id, member],
  }
}
