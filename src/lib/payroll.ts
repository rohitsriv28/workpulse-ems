import type { AttendanceRecord } from "../features/attendance/types";
import type { Employee } from "../features/employees/types";
import { getDaysInMonth, parseISO } from "date-fns";

interface PayrollResult {
  employeeId: string;
  totalDaysInMonth: number;
  salary: number;
  calculatedSalary: number;
  presentDays: number;
  wfhDays: number;
  halfDays: number;
  absentDays: number;
  paidLeavesUsed: number;
  unpaidLeaves: number;
  deductionAmount: number;
}

export const calculatePayroll = (
  employee: Employee,
  attendanceRecords: AttendanceRecord[],
  monthStr: string // "YYYY-MM"
): PayrollResult => {
  const date = parseISO(`${monthStr}-01`);
  const totalDaysInMonth = getDaysInMonth(date);
  const dailyRate = employee.salary / totalDaysInMonth; // Simple daily rate calculation

  let presentDays = 0;
  let wfhDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let leaveDays = 0;

  // Filter records for the specific month
  const monthlyRecords = attendanceRecords.filter(
    (record) =>
      record.date.startsWith(monthStr) && record.employeeId === employee.id
  );

  monthlyRecords.forEach((record) => {
    switch (record.status) {
      case "PRESENT":
      case "LATE": // Late counts as present for base salary typically (unless specific late policy)
        presentDays++;
        break;
      case "WFH":
        wfhDays++;
        break;
      case "HALF_DAY":
        halfDays++;
        break;
      case "ABSENT":
        absentDays++;
        break;
      case "ON_LEAVE":
        leaveDays++;
        break;
    }
  });

  // Calculation Logic per user request:
  // "3 leaves be paid leaves in a month if more than that consider it as absent"
  // "deduct that salary by per half day" -> Assuming Absents and Excessive Leaves are deducted.

  const ALLOWED_PAID_LEAVES = 3;

  // Total "Absent-like" days from Leaves
  const paidLeavesUsed = Math.min(leaveDays, ALLOWED_PAID_LEAVES);
  const excessLeaves = Math.max(0, leaveDays - ALLOWED_PAID_LEAVES);

  // Total Penalty Days
  // Absent days are fully deducted.
  // Excess leaves are deducted.
  // Half days count as 0.5 present, 0.5 deducted.

  // Actually, standard logic:
  // Paid Days = Present + WFH + PaidLeaves
  // But wait, what if they just didn't mark attendance? (That's absent).
  // Implicit absent? The records might be sparse.
  // For this mock, we assume 'absentDays' comes from explicit records OR we rely on calculation.
  // Let's rely on explicit records for now to keep it simple, or user might complain "numbers don't match".

  const unpaidLeaves = excessLeaves + absentDays;
  const halfDayDeductions = halfDays * 0.5;

  const totalDeductionDays = unpaidLeaves + halfDayDeductions;

  const deductionAmount = totalDeductionDays * dailyRate;
  const calculatedSalary = Math.max(0, employee.salary - deductionAmount);

  return {
    employeeId: employee.id,
    totalDaysInMonth,
    salary: employee.salary,
    calculatedSalary,
    presentDays,
    wfhDays,
    halfDays,
    absentDays,
    paidLeavesUsed,
    unpaidLeaves: totalDeductionDays, // displaying total days lost
    deductionAmount,
  };
};
