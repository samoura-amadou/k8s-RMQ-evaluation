const faker = require('faker')
const fetch = require('node-fetch')
const URL = 'http://localhost'
const PORT = 4040
const owner = '100767209966287077820'
const projectIDs = [
  'ad88df09-3458-4247-8f1d-a3444b24e927',
  '8acb6a96-1a9e-40ea-b73a-1d6a6ef9d292',
  '306b362f-310b-4f1e-9013-96d7399bb56b',
  '684ce6e6-7594-4f28-8097-fdf69beea023',
]
const projects = [
  {
    id: 'ad88df09-3458-4247-8f1d-a3444b24e927',
    info: { title: 'TacTill', color: 'green', collaborators: [] },
    owner: '100767209966287077820',
    created_at: '2021-04-05T18:38:47.501Z',
    updated_at: '2021-04-05T18:38:47.501Z',
  },
  {
    id: '8acb6a96-1a9e-40ea-b73a-1d6a6ef9d292',
    info: { title: 'daar', color: 'blue', collaborators: [] },
    owner: '100767209966287077820',
    created_at: '2021-04-05T18:38:47.508Z',
    updated_at: '2021-04-05T18:38:47.508Z',
  },
  {
    id: '306b362f-310b-4f1e-9013-96d7399bb56b',
    info: { title: 'Timy', color: 'yellow', collaborators: [] },
    owner: '100767209966287077820',
    created_at: '2021-04-05T18:38:47.511Z',
    updated_at: '2021-04-05T18:38:47.511Z',
  },
  {
    id: '684ce6e6-7594-4f28-8097-fdf69beea023',
    info: { title: 'cfa', color: 'red', collaborators: [] },
    owner: '100767209966287077820',
    created_at: '2021-04-05T18:38:47.513Z',
    updated_at: '2021-04-05T18:38:47.513Z',
  },
]

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ild0ZFdMenVaSm1IaE80OWdaYnJuWiJ9.eyJpc3MiOiJodHRwczovLzMxZGF5cy1kZXYuZXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwNzY3MjA5OTY2Mjg3MDc3ODIwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDA0MCIsImh0dHBzOi8vMzFkYXlzLWRldi5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjE3NTc0OTYzLCJleHAiOjE2MTc2NjEzNjMsImF6cCI6IjhZU1JjSXZJejJiVno1WmhwbnJReVhrRkVHTDdZQ1IzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.rQwHvtYo_8OF4Pwq5cGueE8u1ycOUk-zUBK6osoDtnzLLIvF1kE7Ofg8bbdguTOkYptV0RICCZJZVApqlXbW2SuzErhYfeWIBYcz7hqsFVcnw_1lFqhqZWyoPa8IfhUZLtfhcsNFANrGzx-GKik-RqW3JNavDG--utc5atsg-Oqtj8WuTDBg--c8c0O0i7puHOof2AF5rNdyrsdhBjIeW9fSULj8tldl0YSiurIpeYwkt5-OJG8WBywEUW02APIo5raEVGRxXG-OzVN5SJY_--vagYHLHcQcesTHETF1gqIBRdl_EoVaPf4vaNyWeprwHNzwgKTZwBdQZSra_goXAQ'
const data = require('./arthur.json')

const createProject = ({ info, id, owner }) =>
  fetch(`${URL}:${PORT}/project/update`, {
    method: 'POST',
    body: JSON.stringify({ owner, info, id }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
    },
  })

const getProject = id =>
  fetch(`${URL}:${PORT}/project?id=${id}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
    },
  })

const a = {
  date: '',
  type: '',
  hours: '',
}

const castTimeValue = value => {
  switch (value) {
    case '4h':
      return 'HALF_DAY'
    default:
      return 'DAY'
  }
}

const createWorkedTime = ({ info, project }) =>
  fetch(`${URL}:${PORT}/worked-time/create`, {
    method: 'POST',
    body: JSON.stringify({ info, project }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
    },
  })

const listWorkTimeByProject = project =>
  fetch(`${URL}:${PORT}/worked-time/project?project=${project}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
    },
  })

const main = async () => {
  await Promise.all(
    projects.map(({ id, info }) => createProject({ info, id, owner }))
  )

  const res = await Promise.all(
    Object.values(data.projects)
      .map(({ id, time }) =>
        time.map(({ date, duration }) => ({
          project: id,
          date,
          type: castTimeValue(duration),
        }))
      )
      .reduce((acc, val) => acc.concat(val), [])
      .map(({ project, date, type }) =>
        createWorkedTime({ info: { date, type }, project })
      )
  )
  console.log(res)
  const result = await Promise.all(res.map(r => r.json()))
  console.log(result)
}
main()
