const faker = require('faker')
const fetch = require('node-fetch')
const URL = 'http://localhost'
const PORT = 4040
const { floor, random } = Math

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ild0ZFdMenVaSm1IaE80OWdaYnJuWiJ9.eyJpc3MiOiJodHRwczovLzMxZGF5cy1kZXYuZXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwNzY3MjA5OTY2Mjg3MDc3ODIwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDA0MCIsImh0dHBzOi8vMzFkYXlzLWRldi5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjY3ODE0MTk5LCJleHAiOjE2Njc5MDA1OTksImF6cCI6Imt5QWJPa3pPODVEb3VIdjhONE1acEdnY1ZzTDVHRnROIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.LVMxh48Bcnsi6KcIH48DmDwbZAlXxRYj2NzclDZcTVwr9pvo8ZHP0lDWrfvT1wenV2wjuje7EzHHkTWNSq9cXv06AOczprDjcuggkbolWWEcFf4szoMjcNJ6IR3TigK4nIE6tueTzdnvmrzI29_2Crv07mVUS304wNmt77ClvjRiv6XC5bK2mj9TUIovYuzTwuMVrh5GFoQm6XUKezlFjij41SWK4MnGU8mTQTpNPngeq18VPd7i6tThY9zQ7xi0xY0cF_67vYrA9HpPtzPRVvJMtaAPETgWZovST3k-VqOjRo0_iitw0_jelwcX8zDaRBCap9FSx6cfiryrTHD9kQ'

const COLORS = [
  'blue',
  'red',
  'yellow',
  'cyan',
  'green',
  'orange',
  'pink',
  'purple',
]

const generatePastDate = day => {
  const r = new Date()
  r.setHours(1)
  r.setMinutes(0)
  r.setSeconds(0)
  r.setMilliseconds(0)
  return new Date(r.getTime() - 24 * 60 * 60 * 1000 * day)
}
const generateInt = max => floor(random() * max)

const generateColor = () => COLORS[generateInt(COLORS.length)]

const generateProject = () => ({
  info: {
    color: generateColor(),
    name: faker.company.companyName(),
    date: generatePastDate(10),
  },
})

const generateWorkedTime = ({ project }) => ({
  project,
  info: {
    hours: generateInt(8),
    date: generatePastDate(generateInt(8)),
    category: 'hours',
  },
})

const createProject = async () => {
  const project = generateProject()
  const ret = await fetch([URL, ':', PORT, '/project/create'].join(''), {
    method: 'POST',
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
  return await ret.json()
}

const createWorkedTime = async ({ project }) => {
  const workedTime = generateWorkedTime({ project })
  const ret = await fetch([URL, ':', PORT, '/worked-time/create'].join(''), {
    method: 'POST',
    body: JSON.stringify(workedTime),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
  return await ret.json()
}

const main = async () => {
  const p = await createProject()
  const project = p.id
  console.log(
    await Promise.all(
      new Array(24).fill(1).map(_ => createWorkedTime({ project }))
    )
  )
  const delWorkedTime = `delete from worked_time where project='${p.id}';`
  const delProj = `delete from project where id='${p.id}';`
  console.log(delWorkedTime)
  console.log(delProj)
}

main()
