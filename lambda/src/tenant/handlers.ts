import { response, forbidden } from '@frenchpastries/millefeuille/response'
import {
  selectById,
  updateOrInsert,
  listByOwner,
  addMembers,
  removeMembers,
  listByMember,
} from './queries'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { log } from '../utils/logger'
import { client } from '../db'
import { TenantInfo } from './types'

const getTenant = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
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
  const old = id ? await getTenant({ id }) : []
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  if (query) {
    const { rows } = await client.query(query)
    log(rows)
    log('done')
    return response(rows[0])
  }
  return forbidden('no id nor owner')
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

export const getTenantHandler = async (request: IncomingRequest) => {
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

export const listTenantByOwnerHandler = async (request: IncomingRequest) => {
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

export const removeMembersHandler = async (request: IncomingRequest) => {
  const uid = request.uid //// TODO: verify that uid is able to modify the project
  const member = request.body.uid
  const id = request.context.id
  log(member, id)
  if (member && id) {
    const query = removeMembers({ id, member })
    const res = await client.query(query)
    return response(res.rows)
  } else return forbidden('no data')
}

export const addMembersHandler = async (request: IncomingRequest) => {
  const uid = request.uid //// TODO: verify that uid is able to modify the project
  const member = request.body.uid
  const id = request.context.id
  log(member, id)
  if (member && id) {
    const query = addMembers({ id, member })
    const res = await client.query(query)
    return response(res.rows)
  } else return forbidden('no data')
}

export const getTenantMembers = async (request: IncomingRequest) => {
  const id = request.context.id
  log(id)
  if (id) {
    const query = selectById(id)
    const res = await client.query(query)
    if (res.rows.length > 0) return response(res.rows[0].members)
    return forbidden('no tenant')
  } else return forbidden('no owner')
}

export const listTenantByOwnerAndMemberHandler = async (
  request: IncomingRequest
) => {
  const member = request.uid
  log({ member })
  if (member) {
    const byMembers = await client.query(listByMember({ member }))
    const byOwner = await client.query(listByOwner({ owner: member }))
    const data = [...(byMembers.rows ?? []), ...(byOwner.rows ?? [])]
    return response(data.map(d => ({ ...d, members: JSON.parse(d.members) })))
  } else {
    return forbidden('no id')
  }
}
