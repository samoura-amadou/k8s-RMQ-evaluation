const faker = require('faker')
const fetch = require('node-fetch')
const URL = 'http://localhost'
const PORT = 3000
const owner = '3b18f13e-f3fc-4bc8-bb65-bf29ca946c95'

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

const main = async () => {
  console.log(await createProjects(10))
}

main()
