import { getStore } from "./store";
import type { UserSession } from "../../types";

export interface AIResponse {
  answer: string;
  sourceCitations?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

export async function askHRAssistant(
  prompt: string,
  user: UserSession,
): Promise<AIResponse> {
  const store = getStore();
  const lower = prompt.toLowerCase();

  // 1. Leave queries
  if (
    lower.includes("leave") &&
    (lower.includes("balance") ||
      lower.includes("how many") ||
      lower.includes("left"))
  ) {
    const empId = user.employeeId || "EMP004";
    const bal = store.leaveBalances[empId] || {
      annual: { available: 15 },
      casual: { available: 10 },
      sick: { available: 9 },
    };
    return {
      answer: `Hello ${user.name}, you currently have:\n• **${bal.annual.available} days** of Annual Leave\n• **${bal.casual.available} days** of Casual Leave\n• **${bal.sick.available} days** of Sick Leave available.\n\nAll leaves can be applied directly from your leave portal.`,
      sourceCitations: [
        "Leave Entitlement Policy 2026",
        "Employee Leave Ledger",
      ],
      actionLink: { label: "Apply for Leave", url: "/my-leave" },
    };
  }

  // 2. Policy: Half-day and late arrival
  if (
    lower.includes("half day") ||
    lower.includes("late") ||
    lower.includes("deduction") ||
    lower.includes("penalty")
  ) {
    return {
      answer: `According to the corporate **Attendance & Payroll Policy 2026**:\n\n1. **Late Arrival Grace Period**: A 15-minute grace period is permitted (until 09:15 AM). Arrival after grace is marked as 'Late'.\n2. **Paid Leaves Allowance**: Up to 3 days of leave per calendar month are fully paid. Any additional leave days are marked unexcused and deducted from monthly salary.\n3. **Half-Day Deductions**: Each approved half-day incurs a 50% deduction of that day's rate (0.5 working day).`,
      sourceCitations: [
        "HR Policy Manual §4.2 (Punctuality)",
        "Payroll Deduction Formula §3.1",
      ],
      actionLink: { label: "View HR Policies", url: "/announcements" },
    };
  }

  // 3. Holidays
  if (
    lower.includes("holiday") ||
    lower.includes("next off") ||
    lower.includes("vacation")
  ) {
    const nextHol = store.holidays[0];
    return {
      answer: `The upcoming official holiday is **${nextHol.name}** on **${nextHol.date}** (${nextHol.type} Holiday) across ${nextHol.locations.join(", ")}. Enjoy your planned break!`,
      sourceCitations: ["Corporate Holiday Calendar 2026"],
      actionLink: { label: "View All Holidays", url: "/holidays" },
    };
  }

  // 4. Shift & Schedules
  if (
    lower.includes("shift") ||
    lower.includes("timing") ||
    lower.includes("working hours")
  ) {
    return {
      answer: `Your standard working schedule is **General Morning Shift** from **09:00 AM to 06:00 PM** (8 working hours + 60 minutes break allowance). Core business collaboration hours are 10:00 AM to 05:00 PM.`,
      sourceCitations: ["Shift Schedule Master (SCH01)"],
      actionLink: { label: "View My Schedule", url: "/my-schedule" },
    };
  }

  // 5. Payslip / Salary
  if (
    lower.includes("payslip") ||
    lower.includes("salary") ||
    lower.includes("payout") ||
    lower.includes("pay")
  ) {
    const slip =
      store.payslips.find((p) => p.employeeId === user.employeeId) ||
      store.payslips[0];
    return {
      answer: `Your latest payslip for **${slip.periodName}** was processed with a Net Payout of **₹${slip.netPay.toLocaleString("en-IN")}** (Gross: ₹${slip.grossPay.toLocaleString("en-IN")}, Deductions: ₹${slip.totalDeductions.toLocaleString("en-IN")}). Disbursed on ${slip.payDate}.`,
      sourceCitations: [`Payslip Record: ${slip.id}`],
      actionLink: { label: "Download Payslip", url: "/my-payslips" },
    };
  }

  // 6. HR / Manager questions
  if (user.role === "HR" || user.role === "ADMIN") {
    if (
      lower.includes("exception") ||
      lower.includes("attention") ||
      lower.includes("pending")
    ) {
      const pendingCorr = store.corrections.filter(
        (c) => c.status === "PENDING",
      ).length;
      const pendingLeaves = store.leaveRequests.filter(
        (l) => l.status === "PENDING",
      ).length;
      return {
        answer: `Today's attention summary:\n• **${pendingLeaves} Pending Leave Request(s)** requiring review\n• **${pendingCorr} Pending Attendance Correction(s)**\n• **1 Late arrival** and **1 Unexcused absence** flagged today.`,
        sourceCitations: ["Realtime Attendance & Leave Registry"],
        actionLink: { label: "Open Attendance Exceptions", url: "/attendance" },
      };
    }
  }

  // Default helpful response
  return {
    answer: `I can help you with your attendance tracking, leave balances, company holidays, payroll inquiries, and HR policies. Try asking:\n• *"How many leaves do I have left?"*\n• *"What is the policy on half days and late arrival?"*\n• *"When is the next company holiday?"*\n• *"Explain my latest payslip."*`,
    sourceCitations: ["EMS Knowledge Base 2026"],
  };
}
