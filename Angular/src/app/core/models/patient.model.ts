export interface Patient {
  id?: string;
  ppsn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'O';
  phoneNumber: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergencyContactName: string;
  emergencyContactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
