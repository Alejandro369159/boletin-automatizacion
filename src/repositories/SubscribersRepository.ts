import { db } from '@/services/firebase'
import { type Subscriber, type NewSubscriber, subscribersFromFirestore } from '@/types/Subscriber'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore'

export class SubscribersRepository {
  public collectionRef = collection(db, 'subscribers')

  public async get(): Promise<Subscriber[]> {
    const subscribers = await getDocs(this.collectionRef)
    return subscribers.docs.map(subscribersFromFirestore)
  }

  public async create(subscriber: NewSubscriber): Promise<void> {
    await addDoc(this.collectionRef, {
      ...subscriber,
      status: 'Activo',
      createdAt: Timestamp.now(),
    })
  }

  public async show(id: string): Promise<Subscriber | null> {
    const subscriber = await getDoc(doc(this.collectionRef, id))
    return subscribersFromFirestore(subscriber)
  }

  public async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, id))
  }
}

export default new SubscribersRepository()
