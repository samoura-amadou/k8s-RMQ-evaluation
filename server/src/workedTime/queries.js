const { log } = require('../utils/logger')

const selectById = id => {
  return { text: 'SELECT * FROM worked_time WHERE id = $1', values: [id] }
}

const updateOrInsert = ({ exist, id, info, project }) => {
  if (exist) {
    log('update', { id, info })
    return {
      text: 'UPDATE worked_time SET info = $2 WHERE id = $1 RETURNING id',
      values: [id, info],
    }
  } else {
    log('create', { id, info, project })
    if (id) {
      return {
        text:
          'INSERT INTO worked_time (id, info, project) VALUES ($1, $2, $3) RETURNING id',
        values: [id, info, project],
      }
    } else {
      return {
        text:
          'INSERT INTO worked_time (info, project) VALUES ($1, $2) RETURNING id',
        values: [info, project],
      }
    }
  }
}

const listByProject = ({ project }) => {
  log('listByProject', { project })
  return {
    text: 'SELECT * FROM worked_time where project = $1',
    values: [project],
  }
}

const list = ({ owner }) => {
  log('listByProject', { owner })
  return {
    text: `SELECT worked_time.info, project.info as p_info, project.id as pid, worked_time.id
      FROM worked_time
      RIGHT JOIN project ON project.id=worked_time.project
      WHERE project.owner = $1`,
    values: [owner],
  }
}

module.exports = {
  selectById,
  updateOrInsert,
  listByProject,
  list,
}
