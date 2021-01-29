const faker = require('faker')
const fetch = require('node-fetch')
const URL = 'http://localhost'
const PORT = 3000
const owner = '3b18f13e-f3fc-4bc8-bb65-bf29ca946c95'
const projects = [
  '58bba02a-5e79-434c-9e40-3d9b151b134e',
  // '483b068e-7c64-4324-b01f-59f964184f3f',
  // '6af45b72-0cdb-41ed-9a24-7df18d0513ae',
  // '434e4a17-e10f-46e6-b2f3-2af4b89532cc',
  // 'c90f1d93-35f3-4f7e-814e-2a5a3371d355',
]

const generateProject = ({ owner }) => ({
  owner,
  info: {
    color: faker.commerce.color(),
    name: faker.company.companyName(),
  },
})

const createProject = async () => {
  const project = generateProject({ owner })
  const ret = await fetch([URL, ':', PORT, '/project/create'].join(''), {
    method: 'POST',
    body: JSON.stringify(project),
    headers: { 'Content-Type': 'application/json' },
  })
  return await ret.json()
}

const createProjects = n =>
  Promise.all(
    Array(n)
      .fill(n)
      .map(_ => createProject())
  )

const generateWorkedTime = ({ project }) => ({
  project,
  info: {
    time: faker.random.number(10),
    date: faker.date.recent(),
  },
})

const createWorkedTime = async ({ project }) => {
  const workedTime = generateWorkedTime({ project })
  const ret = await fetch([URL, ':', PORT, '/worked-time/create'].join(''), {
    method: 'POST',
    body: JSON.stringify(workedTime),
    headers: { 'Content-Type': 'application/json' },
  })
  return await ret.json()
}

const createWorkedTimes = async () =>
  Promise.all(
    projects.map(project =>
      Promise.all(
        Array(faker.random.number(10))
          .fill(0)
          .map(_ => createWorkedTime({ project }))
      )
    )
  )

const main = async () => {
  console.log(await createWorkedTimes())
}

main()
