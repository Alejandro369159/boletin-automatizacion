import { db } from '@/services/firebase'
import { emailFromFirestore, type Email, type NewEmail } from '@/types/Email'
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore'

export class EmailsRepository {
  public async list(): Promise<Email[]> {
    const ref = collection(db, 'emails')
    const emails = await getDocs(ref)
    return emails.docs.map(emailFromFirestore)
  }

  public async get(docId: string): Promise<Email | null> {
    const docRef = doc(db, 'emails', docId)
    const email = await getDoc(docRef)
    return email.exists() ? emailFromFirestore(email) : null
  }

  public async create(email: NewEmail): Promise<void> {
    await addDoc(collection(db, 'emails'), email)
  }
}
