import type { DocumentSnapshot } from 'firebase/firestore'

export type Subscriber = {
  id: string
  name: string
  email: string
  businessName: string
  status: string
  createdAt: Date
}

export type NewSubscriber = {
  name: string
  email: string
  businessName: string
}

export function subscribersFromFirestore(doc: DocumentSnapshot): Subscriber {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }
  return {
    id: doc.id,
    name: doc.data().name,
    email: doc.data().email,
    businessName: doc.data().businessName,
    status: doc.data().status,
    createdAt: doc.data().createdAt.toDate().toLocaleDateString(),
  }
}
