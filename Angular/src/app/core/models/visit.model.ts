export interface Visit {
  id?: string;
  patientId: string;
  visitDate?: string;
  notes: string;
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}
