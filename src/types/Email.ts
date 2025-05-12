import type { QueryDocumentSnapshot } from 'firebase/firestore'
import type { WeekDay } from './Time'

export type NewEmail = Omit<Email, 'id'>

export type Email = {
  id: string
  title: string
  subject: string
  body: string
  filesUrls: string[]
  mode: 'daily' | 'some-days' | 'unique'
  days: WeekDay[] | null
  sendAtDate: Date | null
  sendAtHour: Date
  addresseeMode: 'all' | 'some' | 'percent'
  addresseeEmails: string[] | string | null
  addresseePercent: number | null
  createdAt: Date
}

export function emailFromFirestore(doc: QueryDocumentSnapshot): Email {
  return {
    id: doc.id,
    title: doc.data().title,
    subject: doc.data().subject,
    body: doc.data().body,
    filesUrls: doc.data().filesUrls,
    mode: doc.data().mode,
    days: doc.data().days,
    sendAtDate: doc.data().sendAtDate ? doc.data().sendAtDate.toDate() : null,
    sendAtHour: doc.data().sendAtHour ? doc.data().sendAtHour.toDate() : null,
    addresseeMode: doc.data().addresseeMode,
    addresseeEmails: doc.data().addresseeEmails,
    addresseePercent: doc.data().addresseePercent,
    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
  }
}
