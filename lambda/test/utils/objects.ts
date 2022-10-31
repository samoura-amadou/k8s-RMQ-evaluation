import { Project } from '../../src/project/types'
import { UserInfo } from '../../src/user-info/types'
import { v4 as uuid } from 'uuid'

export const generateProject = (id?: string): Project => ({
  id: id ? id : uuid(),
  work: {
    time: { category: 'cat', hours: 2, id: 'WID', date: new Date() },
  },
  info: {
    name: 'Test',
    color: 'blue',
    date: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const generateOwner = (id?: string): UserInfo => ({
  id: id ? id : uuid(),
  info: {
    firstName: 'Edgar',
    lastName: 'Garisme',
    job: 'tennisman',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
})
