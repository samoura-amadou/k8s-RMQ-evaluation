const { response, forbidden } = require('@frenchpastries/millefeuille/response')
const {
  selectById,
  updateOrInsert,
  listByProject,
  list,
  del,
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

const createOrUpdate = async ({ id, info, project, uid }) => {
  const old = await getWorkedTime({ id })
  const exist = old.length > 0
  const query = updateOrInsert({ exist, id, info, project, uid })
  log(query)
  const { rows } = await client.query(query)
  log(rows)
  log('done')
  return response(rows[0])
}

const createOrUpdateWorkTimeHandler = async ({ body, uid }) => {
  const { id, info, project } = body
  log(body)
  return createOrUpdate({ id, info, project, uid })
}

const getWorkTimeHandler = async ({ location }) => {
  const id = location.searchParams.get('id')
  if (id) {
    return getWorkedTime({ id })
  } else {
    return forbidden('no id')
  }
}

const listWorkTimeByProjectHandler = async ({ location }) => {
  const project = location.searchParams.get('project')
  log({ project })
  if (project) {
    const query = listByProject({ project })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no project id')
  }
}

const listWorkTimeHandler = async ({ location }) => {
  const owner = location.searchParams.get('owner')
  log({ owner })
  if (owner) {
    const query = list({ owner })
    const { rows } = await client.query(query)
    return response(rows ?? [])
  } else {
    return forbidden('no owner')
  }
}

const deleteWorkTimeHandler = async ({ location }) => {
  const id = location.searchParams.get('id')
  log({ id })
  if (id) {
    const query = del({ id })
    await client.query(query)
    return response(true)
  } else {
    return forbidden('no id')
  }
}

module.exports = {
  createOrUpdateWorkTimeHandler,
  getWorkTimeHandler,
  listWorkTimeByProjectHandler,
  listWorkTimeHandler,
  deleteWorkTimeHandler,
}
