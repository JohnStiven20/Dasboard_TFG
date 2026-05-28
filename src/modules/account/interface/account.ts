import type { Worker } from "../../../interface/subject/subject";


export interface Account {
  id?: number;
  username: string;
  password?: string;
  typeAccount?: string | null;
  isactive?: boolean | null;
  createdAt?: string | null;
  subjectName?: string | null;
  subjectEmail?: string | null;
  subjectPhone?: string | null;
  subjectEmployeeCode?: string | null;
  subjectObservation?: string | null;
  subjectCreatedAt?: string | null;
  subjectUpdatedAt?: string | null;
  subject: Worker;
}