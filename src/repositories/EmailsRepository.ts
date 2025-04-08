import { db } from '@/services/firebase'
import { emailsFromFirestore, type Email, type NewEmail } from '@/types/Email'
import { addDoc, collection, getDocs } from 'firebase/firestore'

export class EmailsRepository {
  public async get(): Promise<Email[]> {
    const ref = collection(db, '')
    const emails = await getDocs(ref)
    return emails.docs.map(emailsFromFirestore)
  }

  public async create(email: NewEmail) {
    await addDoc(collection(db, 'emails'), email)
  }
}
