const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const {
  selectById,
  updateOrInsert,
  listByWorkTime,
  list,
} = require('./queries')
const { log } = require('../utils/logger')
const { client } = require('../db')

const getWorkedTime = async ({ id }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  return rows
}

const createOrUpdate = async ({ id, info, project }) => {
  const old = await getWorkedTime({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, project })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0].id)
}

const createOrUpdateWorkTimeHandler = async ({ body }) => {
  const { id, info, project } = body
  log(body)
  log({ id, info, project })
  return createOrUpdate({ id, info, project })
}

const getWorkTimeHandler = async ({ url }) => {
  const { id } = url.query
  if (id) {
    return getWorkedTime({ id })
  } else {
    return forbidden('no id')
  }
}

const listWorkTimeByProjectHandler = async ({ url }) => {
  const { project } = url.query
  log({ project })
  if (project) {
    const query = listByProject({ project })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no project id')
  }
}

const listWorkTimeHandler = async ({ url }) => {
  const { owner } = url.query
  log({ owner })
  if (owner) {
    const query = list({ owner })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}

module.exports = {
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeByProjectHandler,
  listWorkTimeHandler,
}
