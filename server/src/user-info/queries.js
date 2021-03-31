const { log } = require('../utils/logger')

const selectById = id => {
  return { text: 'SELECT * FROM user_info WHERE id = $1', values: [id] }
}

const updateOrInsert = ({ exist, id, info }) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE user_info SET info = $2 WHERE id = $1 RETURNING id',
      values: [id, info],
    }
  } else {
    log('create', { id, info })
    if (id) {
      return {
        text: 'INSERT INTO user_info (id, info) VALUES ($1, $2) RETURNING id',
        values: [id, info],
      }
    } else {
      return {
        text: 'INSERT INTO user_info (info) VALUES ($1) RETURNING id',
        values: [info],
      }
    }
  }
}

module.exports = {
  selectById,
  updateOrInsert,
}
