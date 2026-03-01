export interface Prescription {
  id?: string;
  patientId: string;
  drugName: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}

export const DRUG_CONFLICTS: Record<string, string[]> = {
  'warfarin': ['aspirin', 'ibuprofen'],
  'aspirin': ['warfarin'],
  'ibuprofen': ['warfarin'],
};
