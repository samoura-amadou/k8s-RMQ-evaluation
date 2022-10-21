import { response, forbidden } from '@frenchpastries/millefeuille/response'
import { selectById, updateOrInsert, listByOwner } from './queries'
import { log } from '../utils/logger'
import { client } from '../db'
import { ProjectInfo } from './types'

const getProject = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows
}

const createOrUpdate = async ({
  id,
  info,
  owner,
}: {
  id: string
  info: ProjectInfo
  owner: string
}) => {
  const old = await getProject({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0])
}

export const createOrUpdateProjectHandler = async ({ body }: { body: any }) => {
  const { id, info, owner } = body
  log({ id, info, owner })
  return createOrUpdate({ id, info, owner })
}

export const getProjectHandler = async (request: any) => {
  const id = request.context.id
  if (id) {
    const projectRows = await getProject({ id })
    if (projectRows && projectRows.length > 0) {
      const project = projectRows[0]
      return response(project)
    }
  } else {
    return forbidden('no id')
  }
}

export const listProjectByOwnerHandler = async (request: any) => {
  const owner = request.uid
  log({ owner })
  if (owner) {
    const query = listByOwner({ owner })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}
