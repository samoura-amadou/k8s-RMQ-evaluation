import { log } from '../utils/logger'
import { ProjectInfo } from './types'

export const selectById = (id: string) => {
  return {
    text: `SELECT
       project.id,
       project.info,
       project.owner,
       project.created_at,
       project.updated_at,
       user_info.info as owner_info
     FROM project
     LEFT JOIN user_info ON user_info.id = project.owner
     WHERE project.id = $1`,
    values: [id],
  }
}

export const updateOrInsert = ({
  exist,
  id,
  info,
  owner,
}: {
  exist: boolean
  id: string
  info: ProjectInfo
  owner: string
}) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE project SET info = $2 WHERE id = $1 RETURNING *',
      values: [id, info],
    }
  } else {
    log('create', { id, info, owner })
    if (id) {
      return {
        text: 'INSERT INTO project (id, info, owner) VALUES ($1, $2, $3) RETURNING *',
        values: [id, info, owner],
      }
    } else {
      return {
        text: 'INSERT INTO project (info, owner) VALUES ($1, $2) RETURNING *',
        values: [info, owner],
      }
    }
  }
}

export const listByOwner = ({ owner }: { owner: string }) => {
  log('list', { owner })
  return {
    text: `SELECT
        project.id,
        project.info,
        project.owner,
        project.created_at,
        project.updated_at, user_info.info as owner_info
      FROM project
      LEFT JOIN user_info ON user_info.id = project.owner
      WHERE project.owner = $1`,
    values: [owner],
  }
}

export const listByMember = ({ member }: { member: string }) => {
  log('list', { member })
  return {
    text: `SELECT
        project.id,
        project.info,
        project.owner,
        project.created_at,
        project.updated_at,
        project.members,
        user_info.info as owner_info
      FROM project
      LEFT JOIN user_info ON user_info.id = project.owner
      WHERE project.members::jsonb ? $1`,
    values: [member],
  }
}

export const addMembers = ({ id, member }: { id: string; member: string }) => {
  log('add member', { id, member })

  return {
    text: `UPDATE project
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
    text: `UPDATE project
            SET members = members::jsonb - $2
            WHERE id = $1
            RETURNING id, members`,
    values: [id, member],
  }
}
