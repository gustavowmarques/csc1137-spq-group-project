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

  // returns active prescriptions where end date >= today
  getActiveByPatientId(patientId: string): Observable<Prescription[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByPatientId(patientId).pipe(
      map(prescriptions => prescriptions.filter(p => p.endDate >= today))
    );
  }

  // checks for conflicts with active prescriptions; returns conflicting drug names or an empty array
  async checkDrugConflicts(patientId: string, drugName: string): Promise<string[]> {
    const activePrescriptions = await firstValueFrom(this.getActiveByPatientId(patientId));

    const conflicts: string[] = [];
    const drugLower = drugName.toLowerCase();
    const conflictList = DRUG_CONFLICTS[drugLower] ?? [];

    if (activePrescriptions) {
      for (const prescription of activePrescriptions) {
        const existingDrug = prescription.drugName.toLowerCase();
        if (conflictList.includes(existingDrug)) {
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
}
