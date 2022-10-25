import { response, forbidden } from '@frenchpastries/millefeuille/response'
import { selectById, updateOrInsert, listByOwner } from './queries'
import { log } from '../utils/logger'
import { query as clientQuery } from '../db'
import { TenantInfo } from './types'

const getTenant = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await clientQuery(query)
  log(rows)
  return rows
}

export const createOrUpdate = async ({
  id,
  info,
  owner,
}: {
  id: string
  info: TenantInfo
  owner: string
}) => {
  const old = await getTenant({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  const { rows } = await clientQuery(query)
  log(rows)
  log('done')
  return response(rows[0])
}

export const createOrUpdateTenantHandler = async ({
  body,
}: {
  body: { id: string; info: TenantInfo; owner: string }
}) => {
  const { id, info, owner } = body
  log({ id, info, owner })
  return createOrUpdate({ id, info, owner })
}

export const getTenantHandler = async (request: any) => {
  const id = request.context.id
  if (id) {
    const projectRows = await getTenant({ id })
    if (projectRows && projectRows.length > 0) {
      const project = projectRows[0]
      return response(project)
    }
    return response(null)
  } else {
    return forbidden('no id')
  }
}

export const listTenantByOwnerHandler = async (request: any) => {
  const owner = request.uid
  log({ owner })
  if (owner) {
    const query = listByOwner({ owner })
    const { rows } = await clientQuery(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}
