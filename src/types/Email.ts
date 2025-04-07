export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type Email = {
  id: string
  title: string
  subject: string
  body: string
  filesIds: string[]
  mode: 'daily' | 'some-days' | 'unique' | 'sequence'
  days: WeekDay[] | null
  sendingDay: Date | null
  sendingHour: string
  sequenceTo: string | null
  addresseeMode: 'all' | 'some' | 'percent'
  addresseeEmails: string[] | null
  addresseePercent: number | null
  createdAt: Date
}
