import { selectById, updateOrInsert, listByProject, list, del } from './queries'
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

export const createOrUpdate = async ({
  id,
  info,
  project,
  uid,
}: {
  id: string
  info: Work
  project: string
  uid: string
}) => {
  const old = await getWorkedTime({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, project, uid })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0])
}

export const createOrUpdateWorkTimeHandler = async ({
  body,
  uid,
}: IncomingRequest) => {
  const { id, info, project } = body
  log(body)
  return createOrUpdate({ id, info, project, uid })
}

export const getWorkTimeHandler = async (request: IncomingRequest) => {
  const id = request.location?.searchParams.get('id')
  if (id) {
    return response(getWorkedTime({ id }))
  } else {
    return forbidden('no id')
  }
}

export const listWorkTimeByProjectHandler = async (
  request: IncomingRequest
) => {
  const project = request.location?.searchParams.get('project')
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
  const owner = request.location?.searchParams.get('owner')
  log({ owner })
  if (owner) {
    const query = list({ owner })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}

export const deleteWorkTimeHandler = async (request: IncomingRequest) => {
  const id = request.location?.searchParams.get('id')
  log({ id })
  if (id) {
    const query = del({ id })
    await client.query(query)
    return response(true)
  } else {
    return forbidden('no id')
  }
}
