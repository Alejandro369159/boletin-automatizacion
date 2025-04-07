import type { WeekDay } from './Time'

export type Email = {
  id: string
  title: string
  subject: string
  body: string
  filesIds: string[]
  mode: 'daily' | 'some-days' | 'unique'
  days: WeekDay[] | null
  sendingDay: Date | null
  sendingHour: string
  addresseeMode: 'all' | 'some' | 'percent'
  addresseeEmails: string[] | null
  addresseePercent: number | null
  createdAt: Date
}
