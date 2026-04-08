import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Visit } from '../models/visit.model';

@Injectable({ providedIn: 'root' })
export class VisitService {

  private readonly collectionName = 'visits';

  constructor(private afs: AngularFirestore) {}

  getByPatientId(patientId: string): Observable<Visit[]> {
    return this.afs.collection<Visit>(this.collectionName, ref =>
      ref.where('patientId', '==', patientId).orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Visit;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  getById(id: string): Observable<Visit | undefined> {
    return this.afs.doc<Visit>(`${this.collectionName}/${id}`).valueChanges().pipe(
      map(data => (data ? { ...data, id } : undefined))
    );
  }

  async create(visit: Omit<Visit, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await this.afs.collection(this.collectionName).add({
      ...visit,
      createdAt: new Date()
    });
    return docRef.id;
  }

  async update(id: string, visit: Partial<Omit<Visit, 'id' | 'createdAt'>>): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).update({
      ...visit
    });
  }

  async delete(id: string): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).delete();
  }
}
