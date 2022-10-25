export type Work = { category: string; hours: number; id?: string; date: Date }

export const mapper = (payload: any): Work | null => {
  if ('id' in payload && 'info' in payload) {
    const { id, info } = payload
    if ('category' in info && 'hours' in info) {
      const { category, hours } = info
      const date = new Date(info.date ?? Date.now())
      return { id, category, hours, date }
    }
  }
  return null
}
