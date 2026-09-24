import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useEmployees } from "./useEmployees";
import { useAttendance } from "../attendance/useAttendance";
import { calculatePayroll } from "../../lib/payroll";
import {
  Search,
  Download,
  IndianRupee,
  Calendar,
  Briefcase,
  Home,
  AlertCircle,
} from "lucide-react";

export default function EmployeePayrollReport() {
  const { data: employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const { data: attendance } = useAttendance(new Date(selectedMonth));

  const reportData = useMemo(() => {
    if (!selectedEmployeeId || !employees || !attendance) return null;

    const employee = employees.find((e) => e.id === selectedEmployeeId);
    if (!employee) return null;

    return {
      employee,
      payroll: calculatePayroll(employee, attendance, selectedMonth),
    };
  }, [selectedEmployeeId, selectedMonth, employees, attendance]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-surface p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              Select Employee
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white min-w-[240px] focus:ring-2 focus:ring-primary focus:border-primary"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="">-- Choose Employee --</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            />
          </div>
        </div>

        {reportData && (
          <button className="flex items-center gap-2 px-4 py-2 text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Slip
          </button>
        )}
      </div>

      {/* Report Content */}
      {reportData ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Salary Summary Card */}
          <div className="bg-surface rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-text-main">
                  {reportData.employee.firstName} {reportData.employee.lastName}
                </h2>
                <p className="text-sm text-text-muted">
                  {reportData.employee.department} • {reportData.employee.role}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  Net Salary
                </p>
                <p className="text-2xl font-bold text-primary font-mono">
                  ₹
                  {reportData.payroll.calculatedSalary.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Base Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Base Salary</span>
                  <span className="font-semibold text-text-main">
                    ₹{reportData.payroll.salary.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Total Days</span>
                  <span className="font-mono text-text-main">
                    {reportData.payroll.totalDaysInMonth}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-error">
                    Total Deductions
                  </span>
                  <span className="font-semibold text-error">
                    -₹
                    {reportData.payroll.deductionAmount.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2 },
                    )}
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">
                  Attendance Breakdown
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-text-main">
                    <Briefcase className="w-4 h-4 text-success" /> Present
                  </span>
                  <span className="font-medium">
                    {reportData.payroll.presentDays}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-text-main">
                    <Home className="w-4 h-4 text-blue-500" /> Work From Home
                  </span>
                  <span className="font-medium">
                    {reportData.payroll.wfhDays}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-text-main">
                    <Calendar className="w-4 h-4 text-orange-500" /> Half Days
                  </span>
                  <span className="font-medium">
                    {reportData.payroll.halfDays}
                  </span>
                </div>
              </div>

              {/* Leave Analysis */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">
                  Leave Analysis
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Paid Leaves Used</span>
                  <span className="font-medium text-text-main">
                    {reportData.payroll.paidLeavesUsed} / 3
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-error">
                    <AlertCircle className="w-4 h-4" /> Unpaid / Excess
                  </span>
                  <span className="font-bold text-error">
                    -{reportData.payroll.unpaidLeaves} Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
            <p className="flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> Calculation is based on a daily rate of{" "}
                <strong>
                  ₹
                  {(
                    reportData.payroll.salary /
                    reportData.payroll.totalDaysInMonth
                  ).toFixed(2)}
                </strong>
                . 3 Leaves per month are paid. Excess leaves and explicit
                absences are deducted. Half-days are deducted at 50%.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <IndianRupee className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-text-main">
            No Employee Selected
          </h3>
          <p className="text-text-muted">
            Select an employee and month to generate the payroll report.
          </p>
        </div>
      )}
    </div>
  );
}
