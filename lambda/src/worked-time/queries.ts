import { Work } from './types'
import { log } from '../utils/logger'

export const selectById = (id: string) => {
  return { text: 'SELECT * FROM worked_time WHERE id = $1', values: [id] }
}

export const updateOrInsert = ({
  info,
  project,
  owner,
}: {
  info: Work
  project: string
  owner: string
}) => {
  log('create', { info, project, owner })
  return {
    text: 'INSERT INTO worked_time (info, project, owner) VALUES ($1, $2, $3) RETURNING id',
    values: [info, project, owner],
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
    text: `SELECT DISTINCT ON (worked_time.info->>'date') worked_time.info, project.info as p_info, project.created_at as project_creation, project.id as pid, worked_time.id
      FROM worked_time
      RIGHT JOIN project ON project.id = worked_time.project
      WHERE project.owner = $1
      ORDER BY worked_time.info->>'date', worked_time.updated_at desc`,
    values: [owner],
  }
}
export const listLastUpdated = ({ project }: { project: string }) => {
  return {
    text: `SELECT DISTINCT ON (info->>'date') id, info, updated_at
      FROM worked_time
      WHERE worked_time.project = $1
      ORDER BY info->>'date', updated_at desc`,
    values: [project],
  }
}
