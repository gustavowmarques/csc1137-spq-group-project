export interface Visit {
  id?: string;
  patientId: string;
  notes: string;
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}
