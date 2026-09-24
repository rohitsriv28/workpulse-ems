import { getStore, saveStore } from "./store";
import type {
  Employee,
  AttendanceDay,
  AttendanceCorrection,
  LeaveRequest,
  LeaveBalance,
  ShiftSchedule,
  Holiday,
  PayrollPeriod,
  Payslip,
  EmployeeDocument,
  PerformanceGoal,
  AppNotification,
  Announcement,
  AuditLog,
  UserSession,
  Role,
} from "../../types";

const SIMULATED_LATENCY = 150; // fast responsive feel

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  // Authentication
  async login(email: string, requestedRole?: Role): Promise<UserSession> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    // Check if matching user exists
    let matched = store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!matched) {
      // Find by role if selected
      if (requestedRole) {
        matched = store.users.find((u) => u.role === requestedRole);
      }
    }
    if (!matched) {
      // Default to employee
      matched =
        store.users.find((u) => u.role === "EMPLOYEE") || store.users[0];
    }

    // Add audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      action: "USER_LOGIN",
      resource: `Session: ${matched.id}`,
      user: matched.email,
      role: matched.role,
      status: "SUCCESS",
    };
    store.auditLogs.unshift(audit);
    saveStore(store);

    localStorage.setItem("ems_auth_user", JSON.stringify(matched));
    return matched;
  },

  async getCurrentUser(): Promise<UserSession | null> {
    const raw = localStorage.getItem("ems_auth_user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("ems_auth_user");
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.employees;
  },

  async getEmployee(id: string): Promise<Employee | null> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.employees.find((e) => e.id === id) || null;
  },

  async createEmployee(
    data: Omit<Employee, "id" | "employeeNumber">,
  ): Promise<Employee> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const count = store.employees.length + 1;
    const newId = `EMP${String(count).padStart(3, "0")}`;
    const newEmp: Employee = {
      ...data,
      id: newId,
      employeeNumber: `EMS-1${String(count).padStart(3, "0")}`,
    };
    store.employees.unshift(newEmp);

    // Also initialize leave balance
    store.leaveBalances[newId] = {
      annual: { total: 18, used: 0, available: 18 },
      casual: { total: 12, used: 0, available: 12 },
      sick: { total: 10, used: 0, available: 10 },
      unpaid: 0,
    };

    // Audit log
    store.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      action: "CREATE_EMPLOYEE",
      resource: `Employee: ${newEmp.firstName} ${newEmp.lastName} (${newId})`,
      user: "admin@ems.company.com",
      role: "ADMIN",
      status: "SUCCESS",
    });

    saveStore(store);
    return newEmp;
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const idx = store.employees.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Employee not found");
    store.employees[idx] = { ...store.employees[idx], ...data };

    store.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      action: "UPDATE_EMPLOYEE",
      resource: `Employee: ${id}`,
      user: "hr@ems.company.com",
      role: "HR",
      status: "SUCCESS",
    });

    saveStore(store);
    return store.employees[idx];
  },

  // Attendance
  async getAttendance(
    date?: string,
    department?: string,
  ): Promise<AttendanceDay[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    let res = store.attendance;
    if (date) {
      res = res.filter((a) => a.date === date);
    }
    if (department && department !== "ALL") {
      res = res.filter(
        (a) => a.department.toLowerCase() === department.toLowerCase(),
      );
    }
    return res;
  },

  async getEmployeeAttendance(employeeId: string): Promise<AttendanceDay[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.attendance.filter((a) => a.employeeId === employeeId);
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceDay | null> {
    const today = new Date().toISOString().split("T")[0];
    const store = getStore();
    return (
      store.attendance.find(
        (a) => a.employeeId === employeeId && a.date === today,
      ) || null
    );
  },

  async recordTimeEvent(
    employeeId: string,
    eventType: "CHECK_IN" | "CHECK_OUT" | "BREAK_START" | "BREAK_END",
  ): Promise<AttendanceDay> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const nowIso = now.toISOString();

    let record = store.attendance.find(
      (a) => a.employeeId === employeeId && a.date === today,
    );

    const emp = store.employees.find((e) => e.id === employeeId);
    if (!emp) throw new Error("Employee not found");

    if (!record) {
      record = {
        id: `ATT-${Date.now()}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        date: today,
        schedule: {
          shiftName: "General Morning",
          start: "09:00",
          end: "18:00",
        },
        events: [],
        workState: "PRESENT",
        workMode: emp.workMode,
        punctuality: {
          isLate: false,
          lateMinutes: 0,
          isEarlyDeparture: false,
          earlyMinutes: 0,
          overtimeMinutes: 0,
        },
        workedMinutes: 0,
        scheduledMinutes: 480,
        breakMinutes: 0,
        exceptions: [],
        correctionRequested: false,
      };
      store.attendance.unshift(record);
    }

    record.events.push({
      id: `p-${Date.now()}`,
      type: eventType,
      timestamp: nowIso,
    });

    if (eventType === "CHECK_IN") {
      record.workState = "PRESENT";
      // Calculate late
      const checkInMinutes = now.getHours() * 60 + now.getMinutes();
      const expectedInMinutes = 9 * 60; // 09:00 AM
      if (checkInMinutes > expectedInMinutes + 15) {
        record.punctuality.isLate = true;
        record.punctuality.lateMinutes = checkInMinutes - expectedInMinutes;
        record.exceptions = [
          `Late Arrival (${record.punctuality.lateMinutes}m)`,
        ];
      }
    } else if (eventType === "CHECK_OUT") {
      const checkOutMinutes = now.getHours() * 60 + now.getMinutes();
      const expectedOutMinutes = 18 * 60; // 18:00
      if (checkOutMinutes < expectedOutMinutes) {
        record.punctuality.isEarlyDeparture = true;
        record.punctuality.earlyMinutes = expectedOutMinutes - checkOutMinutes;
      }
      // Calculate total worked
      const firstIn = record.events.find((e) => e.type === "CHECK_IN");
      if (firstIn) {
        const diffMs = now.getTime() - new Date(firstIn.timestamp).getTime();
        record.workedMinutes = Math.max(
          0,
          Math.floor(diffMs / (1000 * 60)) - record.breakMinutes,
        );
      }
    } else if (eventType === "BREAK_END") {
      const lastBreakStart = [...record.events]
        .reverse()
        .find((e) => e.type === "BREAK_START");
      if (lastBreakStart) {
        const diffMs =
          now.getTime() - new Date(lastBreakStart.timestamp).getTime();
        record.breakMinutes += Math.max(0, Math.floor(diffMs / (1000 * 60)));
      }
    }

    saveStore(store);
    return record;
  },

  // Attendance Corrections
  async getCorrections(): Promise<AttendanceCorrection[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.corrections;
  },

  async submitAttendanceCorrection(
    data: Omit<AttendanceCorrection, "id" | "status" | "submittedAt">,
  ): Promise<AttendanceCorrection> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const newCorr: AttendanceCorrection = {
      ...data,
      id: `COR-${Date.now()}`,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };
    store.corrections.unshift(newCorr);

    // mark attendance day as correctionRequested
    const att = store.attendance.find((a) => a.id === data.attendanceId);
    if (att) {
      att.correctionRequested = true;
      att.correctionId = newCorr.id;
    }

    // Add notification to HR/Manager
    store.notifications.unshift({
      id: `NOT-${Date.now()}`,
      title: "New Attendance Correction Request",
      message: `${data.employeeName} submitted a correction for ${data.date}`,
      type: "ATTENDANCE",
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: "/attendance",
      priority: "NORMAL",
    });

    saveStore(store);
    return newCorr;
  },

  async reviewAttendanceCorrection(
    id: string,
    status: "APPROVED" | "REJECTED",
    comment: string,
  ): Promise<AttendanceCorrection> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const corr = store.corrections.find((c) => c.id === id);
    if (!corr) throw new Error("Correction request not found");
    corr.status = status;
    corr.reviewerComment = comment;

    if (status === "APPROVED") {
      const att = store.attendance.find((a) => a.id === corr.attendanceId);
      if (att) {
        att.exceptions = att.exceptions.filter(
          (ex) => !ex.includes("Missing Checkout"),
        );
        att.exceptions.push("Adjusted via Approved Correction");
      }
    }

    // Notify employee
    store.notifications.unshift({
      id: `NOT-${Date.now()}`,
      title: `Correction Request ${status}`,
      message: `Your attendance correction for ${corr.date} was ${status.toLowerCase()}.`,
      type: "ATTENDANCE",
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: "/my-attendance",
    });

    saveStore(store);
    return corr;
  },

  // Leave Management
  async getLeaveBalances(employeeId: string): Promise<LeaveBalance> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return (
      store.leaveBalances[employeeId] || {
        annual: { total: 18, used: 0, available: 18 },
        casual: { total: 12, used: 0, available: 12 },
        sick: { total: 10, used: 0, available: 10 },
        unpaid: 0,
      }
    );
  },

  async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    if (employeeId) {
      return store.leaveRequests.filter((lr) => lr.employeeId === employeeId);
    }
    return store.leaveRequests;
  },

  async createLeaveRequest(
    data: Omit<LeaveRequest, "id" | "status" | "appliedAt">,
  ): Promise<LeaveRequest> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const newReq: LeaveRequest = {
      ...data,
      id: `LR-${Date.now()}`,
      status: "PENDING",
      appliedAt: new Date().toISOString(),
    };
    store.leaveRequests.unshift(newReq);

    // Notify Manager
    store.notifications.unshift({
      id: `NOT-${Date.now()}`,
      title: "New Leave Application",
      message: `${data.employeeName} applied for ${data.daysCount} days of ${data.leaveType} leave.`,
      type: "LEAVE",
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: "/leave-approvals",
      priority: "NORMAL",
    });

    saveStore(store);
    return newReq;
  },

  async reviewLeaveRequest(
    id: string,
    status: "APPROVED" | "REJECTED",
    reviewerName: string,
    comment?: string,
  ): Promise<LeaveRequest> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const req = store.leaveRequests.find((r) => r.id === id);
    if (!req) throw new Error("Leave request not found");
    req.status = status;
    req.approvedBy = reviewerName;
    req.approverComment = comment;

    if (status === "APPROVED") {
      // Deduct from balance
      const bal = store.leaveBalances[req.employeeId];
      if (bal) {
        if (req.leaveType === "ANNUAL") {
          bal.annual.used += req.daysCount;
          bal.annual.available = Math.max(
            0,
            bal.annual.total - bal.annual.used,
          );
        } else if (req.leaveType === "CASUAL") {
          bal.casual.used += req.daysCount;
          bal.casual.available = Math.max(
            0,
            bal.casual.total - bal.casual.used,
          );
        } else if (req.leaveType === "SICK") {
          bal.sick.used += req.daysCount;
          bal.sick.available = Math.max(0, bal.sick.total - bal.sick.used);
        } else {
          bal.unpaid += req.daysCount;
        }
      }
    }

    // Notify employee
    store.notifications.unshift({
      id: `NOT-${Date.now()}`,
      title: `Leave Request ${status}`,
      message: `Your ${req.leaveType} leave for ${req.startDate} to ${req.endDate} has been ${status.toLowerCase()}.`,
      type: "LEAVE",
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: "/my-leave",
    });

    saveStore(store);
    return req;
  },

  async cancelLeaveRequest(id: string): Promise<LeaveRequest> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const req = store.leaveRequests.find((r) => r.id === id);
    if (!req) throw new Error("Leave request not found");
    req.status = "CANCELLED";
    saveStore(store);
    return req;
  },

  // Schedules & Holidays
  async getSchedules(): Promise<ShiftSchedule[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.schedules;
  },

  async getHolidays(): Promise<Holiday[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.holidays;
  },

  // Payroll
  async getPayrollPeriods(): Promise<PayrollPeriod[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.payrollPeriods;
  },

  async updatePayrollPeriodStatus(
    id: string,
    status: PayrollPeriod["status"],
  ): Promise<PayrollPeriod> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const p = store.payrollPeriods.find((item) => item.id === id);
    if (!p) throw new Error("Payroll period not found");
    p.status = status;

    store.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      action: `PAYROLL_${status}`,
      resource: `Period: ${p.name}`,
      user: "hr@ems.company.com",
      role: "HR",
      status: "SUCCESS",
    });

    saveStore(store);
    return p;
  },

  async getPayslips(employeeId?: string): Promise<Payslip[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    if (employeeId) {
      return store.payslips.filter((p) => p.employeeId === employeeId);
    }
    return store.payslips;
  },

  // Documents
  async getDocuments(employeeId?: string): Promise<EmployeeDocument[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    if (employeeId) {
      return store.documents.filter((d) => d.employeeId === employeeId);
    }
    return store.documents;
  },

  async uploadDocument(
    data: Omit<EmployeeDocument, "id" | "uploadedAt" | "status">,
  ): Promise<EmployeeDocument> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const newDoc: EmployeeDocument = {
      ...data,
      id: `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "VALID",
    };
    store.documents.unshift(newDoc);
    saveStore(store);
    return newDoc;
  },

  async deleteDocument(id: string): Promise<void> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    store.documents = store.documents.filter((d) => d.id !== id);
    saveStore(store);
  },

  // Performance
  async getGoals(employeeId?: string): Promise<PerformanceGoal[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    if (employeeId) {
      return store.goals.filter((g) => g.employeeId === employeeId);
    }
    return store.goals;
  },

  async updateGoalProgress(
    id: string,
    progress: number,
  ): Promise<PerformanceGoal> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    const goal = store.goals.find((g) => g.id === id);
    if (!goal) throw new Error("Goal not found");
    goal.progress = progress;
    if (progress >= 100) {
      goal.status = "COMPLETED";
    }
    saveStore(store);
    return goal;
  },

  // Notifications & Announcements
  async getNotifications(): Promise<AppNotification[]> {
    const store = getStore();
    return store.notifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    const store = getStore();
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    saveStore(store);
  },

  async clearAllNotifications(): Promise<void> {
    const store = getStore();
    store.notifications.forEach((n) => (n.read = true));
    saveStore(store);
  },

  async getAnnouncements(): Promise<Announcement[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.announcements;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    await sleep(SIMULATED_LATENCY);
    const store = getStore();
    return store.auditLogs;
  },

  // Export utility for reports
  exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) => e.map((val) => `"${val}"`).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
