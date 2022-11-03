import {
  selectById,
  updateOrInsert,
  listByProject,
  list,
  listLastUpdated,
} from './queries'
import { response, forbidden } from '@frenchpastries/millefeuille/response'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { log } from '../utils/logger'
import { client } from '../db'
import { Work } from './types'

export const getWorkedTime = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows
}

export type Create = { info: Work; project: string; uid: string }
export const create = async ({ info, project, uid }: Create) => {
  const query = updateOrInsert({ info, project, owner: uid })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0])
}

export const createWorkTimeHandler = async ({ body, uid }: IncomingRequest) => {
  const { info, project } = body
  log(body)
  return create({ info, project, uid })
}

export const getWorkTimeHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  if (id && typeof id === 'string') {
    return response(getWorkedTime({ id }))
  } else {
    return forbidden('no id')
  }
}

export const listWorkTimeByProjectHandler = async (
  request: IncomingRequest
) => {
  const project = request.context.id
  log({ project })
  if (project) {
    const query = listLastUpdated({ project })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no project id')
  }
}

export const historyWorkTimeByProjectHandler = async (
  request: IncomingRequest
) => {
  const project = request.context.id
  log({ project })
  if (project) {
    const query = listByProject({ project })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no project id')
  }
}

export const listWorkTimeHandler = async (request: IncomingRequest) => {
  const owner = request.uid
  log({ owner })
  if (owner) {
    const query = list({ owner })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}
