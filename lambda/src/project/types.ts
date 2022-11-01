import { Work } from '../worked-time/types'

export type Colors =
  | 'blue'
  | 'red'
  | 'yellow'
  | 'cyan'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'

export type ProjectInfo = {
  name: string
  color: Colors
  date: Date
  archivedAt?: Date
}

export type Project = {
  id: string
  info: ProjectInfo
  createdAt: Date
  updatedAt: Date
}

export type Projects = { [key: string]: Project }

export type All = { current: Projects; archived: Projects }

export const mapper = ([pid, data]: [string, any]) => {
  const cr = data.createdAt ?? data.created_at
  const up = data.updatedAt ?? data.updated_at
  const createdAt = new Date(cr)
  const updatedAt = new Date(up ?? cr)
  const info_ = data.info || {
    name: data.name,
    color: data.color,
    date: data.date,
    archivedAt: data.archivedAt ?? data.archived_at,
  }
  const date = new Date(info_.date)
  const archivedAt = new Date(info_.archivedAt ?? info_.archived_at)
  const info = { ...info_, date, archivedAt }
  if (!info_.archivedAt && !info_.archived_at) {
    delete info.archivedAt
    delete info.archived_at
  }
  const lowered = pid.toLowerCase()
  const id = lowered
  const project: Project = { id, info, updatedAt, createdAt }
  return [lowered, project] as [string, Project]
}
