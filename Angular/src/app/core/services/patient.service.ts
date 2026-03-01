import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {

  private readonly collectionName = 'patients';

  constructor(private afs: AngularFirestore) {}

  getAll(): Observable<Patient[]> {
    return this.afs.collection<Patient>(this.collectionName, ref => ref.orderBy('lastName'))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Patient;
          const id = a.payload.doc.id;
          return { ...data, id };
        }))
      );
  }

  getById(id: string): Observable<Patient | undefined> {
    return this.afs.doc<Patient>(`${this.collectionName}/${id}`).valueChanges().pipe(
      map(p => p ? { ...p, id } : undefined)
    );
  }

  async create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await this.afs.collection(this.collectionName).add({
      ...patient,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  async update(id: string, patient: Partial<Patient>): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).update({
      ...patient,
      updatedAt: new Date()
    });
  }

  searchByName(term: string): Observable<Patient[]> {
    return this.getAll().pipe(
      map(patients => {
        const lower = term.toLowerCase();
        return patients.filter(p =>
          p.firstName.toLowerCase().includes(lower) ||
          p.lastName.toLowerCase().includes(lower)
        );
      })
    );
  }
}
