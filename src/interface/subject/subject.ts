
export interface Subject {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  active?: boolean | null;
  observation?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Worker extends Subject {
  employeeCode?: string | null;
  position?: string | null;
}

export interface WorkerUpdatePayload {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  observation?: string | null;
}

export interface WorkerCreatePayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  employeeCode?: string | null;
  position?: string | null;
  observation?: string | null;
}
