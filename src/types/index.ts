// EMS 2026 Core Domain Types & Models

export type Role = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

export type Permission =
  | "view:own_profile"
  | "edit:own_profile"
  | "manage:users"
  | "manage:roles"
  | "view:all_employees"
  | "manage:employees"
  | "view:team_employees"
  | "view:own_attendance"
  | "view:org_attendance"
  | "view:team_attendance"
  | "record:own_attendance"
  | "mark:employee_attendance"
  | "review:attendance_corrections"
  | "manage:schedules"
  | "view:schedules"
  | "apply:leave"
  | "approve:team_leave"
  | "manage:leave_policies"
  | "view:own_payslips"
  | "view:employee_payroll"
  | "process:payroll"
  | "lock:payroll"
  | "manage:documents"
  | "view:own_documents"
  | "manage:performance"
  | "view:own_performance"
  | "view:reports"
  | "view:audit_logs"
  | "manage:notifications"
  | "manage:system_settings"
  | "access:ai_assistant";

export interface UserSession {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatarUrl?: string;
  department?: string;
  designation?: string;
}

export type EmploymentStatus =
  | "ACTIVE"
  | "PROBATION"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "TERMINATED"
  | "ARCHIVED";

export type WorkMode = "OFFICE" | "WFH" | "HYBRID";

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  department: string;
  designation: string;
  role: Role;
  managerId?: string;
  managerName?: string;
  status: EmploymentStatus;
  joinDate: string; // YYYY-MM-DD
  workMode: WorkMode;
  salary: number;
  currency: string;
  location: string;
  scheduleId: string;
}

export type WorkState =
  | "PRESENT"
  | "ABSENT"
  | "PARTIAL_DAY"
  | "HOLIDAY"
  | "WEEKEND";

export interface PunchEvent {
  id: string;
  type: "CHECK_IN" | "CHECK_OUT" | "BREAK_START" | "BREAK_END";
  timestamp: string; // ISO string
}

export interface AttendanceDay {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  schedule: {
    shiftName: string;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  events: PunchEvent[];
  workState: WorkState;
  workMode: WorkMode;
  punctuality: {
    isLate: boolean;
    lateMinutes: number;
    isEarlyDeparture: boolean;
    earlyMinutes: number;
    overtimeMinutes: number;
  };
  workedMinutes: number;
  scheduledMinutes: number;
  breakMinutes: number;
  exceptions: string[]; // e.g. "Missing Checkout", "Unscheduled"
  correctionRequested: boolean;
  correctionId?: string;
}

export interface AttendanceCorrection {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  originalPunch: {
    checkIn?: string;
    checkOut?: string;
  };
  requestedPunch: {
    checkIn: string;
    checkOut: string;
  };
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewerComment?: string;
}

export type LeaveType = "ANNUAL" | "CASUAL" | "SICK" | "UNPAID";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  isHalfDay: boolean;
  halfDayPeriod?: "MORNING" | "AFTERNOON";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  appliedAt: string;
  approvedBy?: string;
  approverComment?: string;
}

export interface LeaveBalance {
  annual: { total: number; used: number; available: number };
  casual: { total: number; used: number; available: number };
  sick: { total: number; used: number; available: number };
  unpaid: number;
}

export interface ShiftSchedule {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  expectedHours: number;
  gracePeriodMinutes: number;
  breakMinutes: number;
  allowedWorkModes: WorkMode[];
  workingDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  assignedEmployeesCount: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: "PUBLIC" | "COMPANY" | "OPTIONAL";
  locations: string[];
}

export type PayrollPeriodStatus =
  | "DRAFT"
  | "PROCESSING"
  | "REVIEW"
  | "APPROVED"
  | "LOCKED"
  | "PUBLISHED";

export interface PayrollPeriod {
  id: string;
  period: string; // YYYY-MM
  name: string; // e.g. "September 2026"
  startDate: string;
  endDate: string;
  status: PayrollPeriodStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  exceptionsCount: number;
}

export interface Payslip {
  id: string;
  periodId: string;
  periodName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  joinDate: string;
  panNumber: string;
  bankAccount: string;
  payDate: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossPay: number;
  leaveDeductions: number;
  taxDeduction: number;
  pfDeduction: number;
  totalDeductions: number;
  netPay: number;
  status: "DRAFT" | "PAID";
  attendanceSummary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    halfDays: number;
    wfhDays: number;
    paidLeavesUsed: number;
    unpaidLeaves: number;
  };
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  name: string;
  category: "CONTRACT" | "ID_PROOF" | "TAX_FORM" | "CERTIFICATE";
  fileSize: string;
  uploadedAt: string;
  expiryDate?: string;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED";
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0 - 100
  status: "ON_TRACK" | "AT_RISK" | "COMPLETED";
  reviewerFeedback?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "LEAVE" | "ATTENDANCE" | "PAYROLL" | "SECURITY" | "ANNOUNCEMENT";
  read: boolean;
  createdAt: string;
  targetUrl?: string;
  priority?: "URGENT" | "NORMAL";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetRole: "ALL" | "EMPLOYEE" | "MANAGER" | "HR";
  priority: "URGENT" | "GENERAL" | "HOLIDAY";
  createdAt: string;
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  user: string;
  role: Role;
  status: "SUCCESS" | "FAILURE";
  details?: string;
}
