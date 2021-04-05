const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const { selectById, updateOrInsert, listByOwner } = require('./queries')
const { log } = require('../utils/logger')
const { client } = require('../db')

const getProject = async ({ id }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows
}

const createOrUpdate = async ({ id, info, owner }) => {
  const old = await getProject({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, owner })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0].id)
}

const createOrUpdateProjectHandler = async ({ body }) => {
  const { id, info, owner } = body
  log({ id, info, owner })
  return createOrUpdate({ id, info, owner })
}

const getProjectHandler = async ({ url }) => {
  const { id } = url.query
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

const listProjectByOwnerHandler = async ({ url }) => {
  const { owner } = url.query
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
  createOrUpdateProjectHandler,
  getProjectHandler,
  listProjectByOwnerHandler,
}
