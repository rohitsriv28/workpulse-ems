export type EmployeeRole = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
export type EmploymentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ON_LEAVE"
  | "TERMINATED";

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: EmployeeRole;
  status: EmploymentStatus;
  joinDate: string;
  salary: number;
}
