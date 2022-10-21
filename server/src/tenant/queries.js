const { log, error } = require('../utils/logger')

const selectById = id => {
  return { text: 'SELECT * FROM tenant WHERE id = $1', values: [id] }
}

const updateOrInsert = ({ exist, id, info, owner }) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE tenant SET info = $2 WHERE id = $1 RETURNING id',
      values: [id, info],
    }
  } else {
    if (owner) {
      log('create', { id, info })
      if (id) {
        return {
          text: 'INSERT INTO tenant (id, info, owner) VALUES ($1, $2, $3) RETURNING id',
          values: [id, info, owner],
        }
      } else {
        return {
          text: 'INSERT INTO tenant (info, owner) VALUES ($1, $2) RETURNING id',
          values: [info, owner],
        }
      }
    } else {
      error('no owner')
      return null
    }
  }
}

const listByOwner = ({ owner }) => {
  log('list', { owner })
  return {
    text: `SELECT
        tenant.id,
        tenant.info,
        tenant.owner,
        tenant.created_at,
        tenant.updated_at,
        tenant.members,
        user_info.info as owner_info
      FROM tenant
      LEFT JOIN user_info ON user_info.id = tenant.owner
      WHERE tenant.owner = $1`,
    values: [owner],
  }
}

module.exports = {
  selectById,
  updateOrInsert,
  listByOwner,
}
