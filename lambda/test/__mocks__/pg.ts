import { jest } from '@jest/globals'

const pg = jest.createMockFromModule('pg')

let result: any[] = []

export const setResult = (r: any) => {
  result = r
}

export class Client {
  constructor(...args: any) {
    console.log(args)
  }

  async query(...args: any) {
    const rows = result.shift()
    if (rows) return { rows }
    return { rows: [] }
  }
}

//@ts-ignore
pg.Client = Client

export default pg
