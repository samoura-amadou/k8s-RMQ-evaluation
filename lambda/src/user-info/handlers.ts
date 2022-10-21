import { response, forbidden } from '@frenchpastries/millefeuille/response'
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

const createOrUpdate = async ({ id, info }: { id: string; info: UserInfo }) => {
  const old = await getUserInfo({ id })
  const exist = Boolean(old)
  const query = updateOrInsert({ exist, id, info })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  if (!exist) {
    log('create tenant')
    const tenant = await createOrUpdateTenant({ id, info: {}, owner: id })
    log(tenant)
  }
  return rows[0].id
}

export const createOrUpdateUserInfoHandler = async ({
  body,
  uid,
}: {
  body: any
  uid: string
}) => {
  const info = body
  log({ uid, info })
  const data = await createOrUpdate({ id: uid, info })
  return response(data)
}

export const getUserInfoHandler = async ({ uid }: { uid: string }) => {
  if (uid) {
    const data = await getUserInfo({ id: uid })
    return response(data)
  } else {
    return forbidden('no id')
  }
}
