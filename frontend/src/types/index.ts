export enum Role {
  PARENT = 'PARENT',
  ADMISSION_TEAM = 'ADMISSION_TEAM',
}

export enum ApplicationStatus {
  APPLICATION_CREATED = 'Application Created',
  REGISTRATION_FEE_PAID = 'Registration Fee Paid',
  SLOT_BOOKED = 'Slot Booked',
  EXAM_COMPLETED = 'Exam Completed',
  ADMISSION_COMPLETED = 'Admission Completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user: User;
}

export interface Student {
  id: string;
  parentId: string;
  studentName: string;
  dateOfBirth: string;
  gender: string;
  previousSchool: string;
  applyingGrade: string;
  status: ApplicationStatus;
  registrationFeePaid?: boolean;
  registrationFeePaidAt?: string | null;
  examSlotId?: string | null;
  examScore?: number | null;
  assignedCourse?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
