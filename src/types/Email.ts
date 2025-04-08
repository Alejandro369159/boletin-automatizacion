import type { DocumentSnapshot } from 'firebase/firestore'
import type { WeekDay } from './Time'

export type NewEmail = Omit<Email, 'id'>

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

export function emailsFromFirestore(doc: DocumentSnapshot): Email {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }
  return {
    id: doc.id,
    title: doc.data().title,
    subject: doc.data().subject,
    body: doc.data().body,
    filesIds: doc.data().filesIds,
    mode: doc.data().mode,
    days: doc.data().days,
    sendingDay: doc.data().sendingDay,
    sendingHour: doc.data().sendingHour,
    addresseeMode: doc.data().addresseeMode,
    addresseeEmails: doc.data().addresseeEmails,
    addresseePercent: doc.data().addresseePercent,
    createdAt: doc.data().createdAt,
  }
}
