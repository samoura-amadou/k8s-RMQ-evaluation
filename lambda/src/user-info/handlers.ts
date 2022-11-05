import { response, forbidden } from '@frenchpastries/millefeuille/response'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { selectById, updateOrInsert } from './queries'
import { log } from '../utils/logger'
import { client } from '../db'
import { createOrUpdate as createOrUpdateTenant } from '../tenant/handlers'
import { UserInfo } from './types'

const getUserInfo = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  const data = rows[0] || null
  log(data)
  return data
}

const createUserTenant = async (id: string, row: any) => {
  log('create tenant')
  const { firstName, lastName } = row.info
  const info = { name: [firstName, lastName].join(' ') }
  const tenant = await createOrUpdateTenant({ id, info, owner: id })
  log(tenant)
}

const createOrUpdate = async ({ id, info }: { id: string; info: UserInfo }) => {
  const old = await getUserInfo({ id })
  const exist = Boolean(old)
  const query = updateOrInsert({ exist, id, info })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  if (!exist) await createUserTenant(id, rows[0])
  return rows[0].id as string
}

export const createOrUpdateUserInfoHandler = async (req: IncomingRequest) => {
  const info = req.body
  const uid = req.uid
  log({ uid, info })
  const data = await createOrUpdate({ id: uid, info })
  return response(data)
}

export const getUserInfoHandler = async ({ uid }: IncomingRequest) => {
  if (uid) {
    const data = await getUserInfo({ id: uid })
    return response(data)
  } else {
    return forbidden('no id')
  }
}
