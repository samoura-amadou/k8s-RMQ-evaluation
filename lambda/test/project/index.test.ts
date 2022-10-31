import { describe, expect, test, jest } from '@jest/globals'
import { generateProject, generateOwner } from '../utils/objects'
import { Project } from '../../src/project/types'
import { UserInfo } from '../../src/user-info/types'

jest.mock('pg')
//@ts-ignore
import { setResult } from 'pg'
import {
  createOrUpdateProjectHandler,
  getProjectHandler,
} from '../../src/project/handlers'

describe('project handler', () => {
  test('create project', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: Project = generateProject()
    const { info: owner_info, id: owner }: UserInfo = generateOwner()
    setResult([[], [{ id, info, owner, owner_info, created_at, updated_at }]])

    const body = { id, info, owner }
    const result = await createOrUpdateProjectHandler({ body })

    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe(id)
    expect(result.body.owner).toBe(owner)
  })

  test('update project', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: Project = generateProject()
    const { info: owner_info, id: owner }: UserInfo = generateOwner()
    setResult([
      [{ id, info, owner, owner_info, created_at, updated_at }],
      [{ id, info, owner, owner_info, created_at, updated_at }],
    ])

    const body = { id, info, owner }
    const result = await createOrUpdateProjectHandler({ body })

    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe(id)
    expect(result.body.owner).toBe(owner)
  })

  test('getProject', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: Project = generateProject()
    const { info: owner_info, id: owner }: UserInfo = generateOwner()
    setResult([[{ id, info, owner, owner_info, created_at, updated_at }]])

    const request = { context: { id } }
    const result = await getProjectHandler(request)

    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe(id)
    expect(result.body.owner).toBe(owner)
    expect(result.body.owner_info.firstName).toBe(owner_info.firstName)
    expect(result.body.owner_info.lastName).toBe(owner_info.lastName)
    expect(result.body.owner_info.job).toBe(owner_info.job)
  })
})
