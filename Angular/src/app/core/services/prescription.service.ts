import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription, DRUG_CONFLICTS } from '../models/prescription.model';
import { AllergyService } from './allergy.service';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {

  private readonly collectionName = 'prescriptions';

  constructor(
    private afs: AngularFirestore,
    private allergyService: AllergyService
  ) {}

  getByPatientId(patientId: string): Observable<Prescription[]> {
    return this.afs.collection<Prescription>(this.collectionName, ref =>
      ref.where('patientId', '==', patientId).orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Prescription;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  getById(id: string): Observable<Prescription | undefined> {
    return this.afs.doc<Prescription>(`${this.collectionName}/${id}`).valueChanges().pipe(
      map(data => (data ? { ...data, id } : undefined))
    );
  }

  // returns active prescriptions where end date >= today
  getActiveByPatientId(patientId: string): Observable<Prescription[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByPatientId(patientId).pipe(
      map(prescriptions => prescriptions.filter(p => p.endDate >= today))
    );
  }

  // checks for conflicts with overlapping prescriptions; returns conflicting medicine names or an empty array
  async checkDrugConflicts(
    patientId: string,
    drugName: string,
    startDate: string,
    endDate: string,
    excludePrescriptionId?: string
  ): Promise<string[]> {
    const allPrescriptions = await firstValueFrom(this.getByPatientId(patientId));

    const conflicts: string[] = [];
    const drugLower = drugName.toLowerCase();
    const conflictList = DRUG_CONFLICTS[drugLower] ?? [];

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    for (const prescription of allPrescriptions) {
      if (excludePrescriptionId && prescription.id === excludePrescriptionId) {
        continue;
      }
      const existingDrug = prescription.drugName.toLowerCase();
      if (conflictList.includes(existingDrug)) {
        const existingStart = new Date(prescription.startDate);
        const existingEnd = new Date(prescription.endDate);
        if (existingStart <= newEnd && newStart <= existingEnd) {
          conflicts.push(prescription.drugName);
        }
      }
    }

    return conflicts;
  }

  // checks if the patient has a severe allergy matching the drug; returns the allergen or null
  async checkAllergyBlock(patientId: string, drugName: string): Promise<string | null> {
    const allergies = await firstValueFrom(this.allergyService.getByPatientId(patientId));

    if (allergies) {
      const drugLower = drugName.toLowerCase();
      const blocking = allergies.find(a =>
        a.severity === 'Severe' && a.allergen.toLowerCase() === drugLower
      );
      if (blocking) {
        return blocking.allergen;
      }
    }

    return null;
  }

  async create(prescription: Omit<Prescription, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await this.afs.collection(this.collectionName).add({
      ...prescription,
      createdAt: new Date()
    });
    return docRef.id;
  }

  async update(id: string, prescription: Omit<Prescription, 'id' | 'createdAt' | 'createdBy'>): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).update({
      ...prescription
    });
  }

  async delete(id: string): Promise<void> {
    await this.afs.doc(`${this.collectionName}/${id}`).delete();
  }
}
