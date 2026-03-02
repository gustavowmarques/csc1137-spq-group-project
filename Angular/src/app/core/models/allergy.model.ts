export type AllergySeverity = 'Mild' | 'Severe';

export interface Allergy {
  id?: string;
  patientId: string;
  allergen: string;
  severity: AllergySeverity;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}
