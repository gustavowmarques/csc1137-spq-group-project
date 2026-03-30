export interface Prescription {
  id?: string;
  patientId: string;
  drugName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  dailyDosage: 'Once' | 'Twice' | 'Thrice';
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}

export const MEDICINE_OPTIONS: string[] = [
  'Aspirin',
  'Ibuprofen',
  'Paracetamol',
  'Amoxicillin',
  'Warfarin'
];

export const DRUG_CONFLICTS: Record<string, string[]> = {
  'warfarin': ['aspirin', 'ibuprofen'],
  'aspirin': ['warfarin'],
  'ibuprofen': ['warfarin'],
};
