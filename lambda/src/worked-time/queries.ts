import { Work } from './types'
import { log } from '../utils/logger'

export const selectById = (id: string) => {
  return { text: 'SELECT * FROM worked_time WHERE id = $1', values: [id] }
}

export const updateOrInsert = ({
  exist,
  id,
  info,
  project,
  owner,
}: {
  exist: boolean
  id: string
  info: Work
  project: string
  owner: string
}) => {
  if (exist) {
    log('update', { id, info, owner })
    return {
      text: 'UPDATE worked_time SET info = $3 WHERE id = $1 AND owner = $2 RETURNING *',
      values: [id, owner, info],
    }
  } else {
    log('create', { id, info, project, owner })
    if (id) {
      return {
        text: 'INSERT INTO worked_time (id, info, project, owner) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [id, info, project, owner],
      }
    } else {
      return {
        text: 'INSERT INTO worked_time (info, project, owner) VALUES ($1, $2, $3) RETURNING *',
        values: [info, project, owner],
      }
    }
  }
}

export const listByProject = ({ project }: { project: string }) => {
  log('listByProject', { project })
  return {
    text: 'SELECT * FROM worked_time where project = $1',
    values: [project],
  }
}

export const list = ({ owner }: { owner: string }) => {
  log('listByProject', { owner })
  return {
    text: `SELECT worked_time.info, project.info as p_info, project.created_at as project_creation, project.id as pid, worked_time.id
      FROM worked_time
      RIGHT JOIN project ON project.id=worked_time.project
      WHERE project.owner = $1`,
    values: [owner],
  }
}

export const del = ({ id }: { id: string }) => {
  log('deleteById', { id })
  return {
    text: `DELETE FROM worked_time WHERE id = $1 RETURNING id`,
    values: [id],
  }
}
