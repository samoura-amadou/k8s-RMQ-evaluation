import { describe, expect, test, jest } from '@jest/globals'
import { generateProject, generateUserInfo } from '../utils/objects'
import { Project } from '../../src/project/types'
import { UserInfo } from '../../src/user-info/types'
import { IncomingRequest } from '@frenchpastries/millefeuille'

jest.mock('pg')
//@ts-ignore
import { setResult } from 'pg'
import {
  createOrUpdateUserInfoHandler,
  getUserInfoHandler,
} from '../../src/user-info/handlers'

describe('user info handler', () => {
  test('create user info', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: UserInfo = generateUserInfo()
    setResult([[], [{ id, info, created_at, updated_at }], []])

    const body = info
    const uid = id
    const args = { body, uid } as unknown as IncomingRequest
    const result = await createOrUpdateUserInfoHandler(args)

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(id)
  })

  test('update user info', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: UserInfo = generateUserInfo()
    setResult([
      [{ id, info, created_at, updated_at }],
      [{ id, info, created_at, updated_at }],
    ])

    const body = info
    const uid = id
    const args = { body, uid } as unknown as IncomingRequest
    const result = await createOrUpdateUserInfoHandler(args)

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(id)
  })

  test('get user info', async () => {
    const {
      info,
      id,
      createdAt: created_at,
      updatedAt: updated_at,
    }: UserInfo = generateUserInfo()
    setResult([[{ id, info, created_at, updated_at }]])

    const request = { uid: id } as unknown as IncomingRequest
    const result = await getUserInfoHandler(request)

    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe(id)
    expect(result.body.info.firstName).toBe(info.firstName)
    expect(result.body.info.lastName).toBe(info.lastName)
    expect(result.body.info.job).toBe(info.job)
  })
})
