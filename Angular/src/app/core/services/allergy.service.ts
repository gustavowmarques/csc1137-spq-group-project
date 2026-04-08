import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Allergy } from '../models/allergy.model';

@Injectable({ providedIn: 'root' })
export class AllergyService {

  private readonly collectionName = 'allergies';

  constructor(private afs: AngularFirestore) {}

  getByPatientId(patientId: string): Observable<Allergy[]> {
    return this.afs.collection<Allergy>(this.collectionName, ref =>
      ref.where('patientId', '==', patientId).orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Allergy;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  getById(id: string): Observable<Allergy | undefined> {
    return this.afs.doc<Allergy>(`${this.collectionName}/${id}`).valueChanges().pipe(
      map(data => (data ? { ...data, id } : undefined))
    );
  }

  async create(allergy: Omit<Allergy, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await this.afs.collection(this.collectionName).add({
      ...allergy,
      createdAt: new Date()
    });
    return docRef.id;
  }

  async update(id: string, allergy: Omit<Allergy, 'id' | 'createdAt'>): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).update({
      ...allergy
    });
  }

  async delete(id: string): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).delete();
  }
}
