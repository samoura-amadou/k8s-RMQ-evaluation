const { log } = require('../utils/logger')

const selectById = id => {
  return { text: 'SELECT * FROM project WHERE id = $1', values: [id] }
}

const updateOrInsert = ({ exist, id, info, owner }) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE project SET info = $2 WHERE id = $1 RETURNING id',
      values: [id, info],
    }
  } else {
    log('create', { id, info, owner })
    if (id) {
      return {
        text:
          'INSERT INTO project (id, info, owner) VALUES ($1, $2, $3) RETURNING id',
        values: [id, info, owner],
      }
    } else {
      return {
        text: 'INSERT INTO project (info, owner) VALUES ($1, $2) RETURNING id',
        values: [info, owner],
      }
    }
  }
}

const listByOwner = ({ owner }) => {
  log('list', { owner })
  return {
    text: 'SELECT * FROM project where owner = $1',
    values: [owner],
  }
}

module.exports = {
  selectById,
  updateOrInsert,
  listByOwner,
}
