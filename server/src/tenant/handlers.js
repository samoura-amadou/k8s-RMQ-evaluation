const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const { selectById, updateOrInsert, listByOwner } = require('./queries')
const { log } = require('../utils/logger')
const { client } = require('../db')

const getTenant = async ({ id }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows
}

const createOrUpdate = async ({ id, info, owner }) => {
  const old = await getTenant({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0])
}

const createOrUpdateTenantHandler = async ({ body }) => {
  const { id, info, owner } = body
  log({ id, info, owner })
  return createOrUpdate({ id, info, owner })
}

const getTenantHandler = async request => {
  const id = request.context.id
  if (id) {
    const projectRows = await getTenant({ id })
    if (projectRows && projectRows.length > 0) {
      const project = projectRows[0]
      return response(project)
    }
  } else {
    return forbidden('no id')
  }
}

const listTenantByOwnerHandler = async request => {
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

module.exports = {
  createOrUpdateTenantHandler,
  getTenantHandler,
  listTenantByOwnerHandler,
  createOrUpdate,
}
