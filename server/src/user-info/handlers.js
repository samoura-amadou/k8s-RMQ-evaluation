const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const { selectById, updateOrInsert } = require('./queries')
const { log } = require('../utils/logger')
const { client } = require('../db')

const getUserInfo = async ({ id }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  const data = rows[0] || null
  log(data)
  return data
}

const createOrUpdate = async ({ id, info }) => {
  const old = await getUserInfo({ id })
  const exist = Boolean(old)
  const query = updateOrInsert({ exist, id, info })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return rows[0].id
}

const createOrUpdateUserInfoHandler = async ({ body, uid }) => {
  const info = body
  log({ uid, info })
  const data = await createOrUpdate({ id: uid, info })
  return response(data)
}

const getUserInfoHandler = async ({ uid }) => {
  if (uid) {
    const data = await getUserInfo({ id: uid })
    return response(data)
  } else {
    return forbidden('no id')
  }
}

module.exports = {
  createOrUpdateUserInfoHandler,
  getUserInfoHandler,
}
