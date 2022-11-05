import { response, forbidden } from '@frenchpastries/millefeuille/response'
import {
  selectById,
  updateOrInsert,
  listByOwner,
  removeMembers,
  addMembers,
  listByMember,
} from './queries'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { log } from '../utils/logger'
import { ProjectInfo } from './types'
import { client } from '../db'

const convertMembersArray = (data: any) => {
  const def = data?.members ?? '[]'
  if (Array.isArray(def)) return { ...data, members: def }
  const members = JSON.parse(def)
  return { ...data, members }
}

const getProject = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows.map(convertMembersArray)
}

type CreateOrUpdate = { id: string; info: ProjectInfo; owner: string }
const createOrUpdate = async ({ id, info, owner }: CreateOrUpdate) => {
  const old = await getProject({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(convertMembersArray(rows[0]))
}

export const createOrUpdateProjectHandler = async (
  request: IncomingRequest
) => {
  const owner = request.uid
  const { id, info } = request.body
  log({ id, info, owner })
  return createOrUpdate({ id, info, owner })
}

export const getProjectHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  if (id && typeof id === 'string') {
    const projectRows = await getProject({ id: decodeURIComponent(id) })
    if (projectRows && projectRows.length > 0) {
      const project = projectRows[0]
      return response(convertMembersArray(project))
    }
    return response(null)
  } else {
    return forbidden('no id')
  }
}

export const listProjectByOwnerHandler = async (request: IncomingRequest) => {
  const owner = request.uid
  log({ owner })
  if (owner && typeof owner === 'string') {
    const query = listByOwner({ owner })
    const { rows } = await client.query(query)
    return response(rows.map(convertMembersArray))
  } else {
    return forbidden('no owner')
  }
}

export const removeMembersHandler = async (request: IncomingRequest) => {
  const uid = request.uid
  const member = request.body.uid
  const id = request.context.id
  log(member, id)
  if (member && id) {
    const query = removeMembers({ id, member })
    const res = await client.query(query)
    return response(res.rows.map(convertMembersArray))
  } else return forbidden('no data')
}

export const addMembersHandler = async (request: IncomingRequest) => {
  const uid = request.uid
  const member = request.body.uid
  const id = request.context.id
  log(member, id)
  if (member && id) {
    const query = addMembers({ id, member })
    const res = await client.query(query)
    return response(res.rows.map(convertMembersArray))
  } else return forbidden('no data')
}

export const getProjectMembers = async (request: IncomingRequest) => {
  const id = request.context.id
  log(id)
  if (id) {
    const query = selectById(id)
    const res = await client.query(query)
    if (res.rows.length > 0)
      return response(convertMembersArray(res.rows[0]).members)
    return forbidden('no tenant')
  } else return forbidden('no owner')
}

export const listProjectByOwnerAndMemberHandler = async (
  request: IncomingRequest
) => {
  const member = request.uid
  log({ member })
  if (member) {
    const query = listByMember({ member })
    const { rows } = await client.query(query)
    return response(rows.map(convertMembersArray))
  } else {
    return forbidden('no id')
  }
}
