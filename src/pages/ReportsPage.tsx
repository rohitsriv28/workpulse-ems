import { useState } from "react";
import { Download } from "lucide-react";
import { api } from "../lib/api/client";
import { getStore } from "../lib/api/store";
import { formatCurrency } from "../lib/utils";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<
    "attendance" | "punctuality" | "leave" | "payroll"
  >("attendance");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [dateRange, setDateRange] = useState("2026-09");

  const store = getStore();

  const handleExport = () => {
    if (reportType === "attendance") {
      const headers = [
        "Employee ID",
        "Name",
        "Department",
        "Date",
        "Status",
        "Mode",
      ];
      const rows = store.attendance.map((a) => [
        a.employeeId,
        a.employeeName,
        a.department,
        a.date,
        a.workState,
        a.workMode,
      ]);
      api.exportCSV(`Attendance_Report_${dateRange}`, headers, rows);
    } else if (reportType === "punctuality") {
      const headers = [
        "Employee",
        "Date",
        "Is Late",
        "Late Minutes",
        "Exceptions",
      ];
      const rows = store.attendance.map((a) => [
        a.employeeName,
        a.date,
        a.punctuality.isLate ? "Yes" : "No",
        a.punctuality.lateMinutes,
        a.exceptions.join(" | ") || "None",
      ]);
      api.exportCSV(`Punctuality_Report_${dateRange}`, headers, rows);
    } else if (reportType === "leave") {
      const headers = [
        "Employee",
        "Category",
        "Days",
        "Start",
        "End",
        "Status",
      ];
      const rows = store.leaveRequests.map((l) => [
        l.employeeName,
        l.leaveType,
        l.daysCount,
        l.startDate,
        l.endDate,
        l.status,
      ]);
      api.exportCSV(`Leave_Utilization_${dateRange}`, headers, rows);
    } else {
      const headers = [
        "Period",
        "Gross Pay",
        "Deductions",
        "Net Pay",
        "Headcount",
      ];
      const rows = store.payrollPeriods.map((p) => [
        p.name,
        p.totalGross,
        p.totalDeductions,
        p.totalNet,
        p.employeeCount,
      ]);
      api.exportCSV(`Payroll_Expenditure_${dateRange}`, headers, rows);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Workforce Reports & Analytics
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Generate audited telemetry summaries and download filtered
            analytical data.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        {[
          { id: "attendance", label: "Attendance Summary" },
          { id: "punctuality", label: "Punctuality & Late Trends" },
          { id: "leave", label: "Leave Utilization" },
          { id: "payroll", label: "Payroll Expenditure" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              reportType === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-muted">
            Month Window:
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option value="2026-09">September 2026 (Current Cycle)</option>
            <option value="2026-08">August 2026 (Archived)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">
            Department Scope:
          </span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Report Data Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-main capitalize">
            {reportType} Dataset
          </h3>
          <span className="text-xs text-text-muted">
            Export ready • UTF-8 CSV Formatted
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === "attendance" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Work State</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-text-main">
                      {a.employeeName}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {a.department}
                    </td>
                    <td className="py-3 px-4 font-mono">{a.date}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      {a.workState}
                    </td>
                    <td className="py-3 px-4">{a.workMode}</td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {(a.workedMinutes / 60).toFixed(1)} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "punctuality" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Late Minutes</th>
                  <th className="py-3 px-4">Early Departure</th>
                  <th className="py-3 px-4">Flagged Exceptions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-text-main">
                      {a.employeeName}
                    </td>
                    <td className="py-3 px-4 font-mono">{a.date}</td>
                    <td className="py-3 px-4 font-mono">
                      {a.punctuality.lateMinutes > 0 ? (
                        <span className="text-amber-700 font-bold">
                          {a.punctuality.lateMinutes} mins
                        </span>
                      ) : (
                        "0m (Punctual)"
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {a.punctuality.earlyMinutes > 0 ? (
                        <span className="text-rose-700 font-bold">
                          {a.punctuality.earlyMinutes} mins
                        </span>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {a.exceptions.join(", ") || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "leave" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Start - End</th>
                  <th className="py-3 px-4">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.leaveRequests.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-text-main">
                      {l.employeeName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {l.leaveType}
                    </td>
                    <td className="py-3 px-4">{l.daysCount} days</td>
                    <td className="py-3 px-4 font-mono text-text-muted">
                      {l.startDate} to {l.endDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {l.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "payroll" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Payroll Cycle</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4 text-right">Leave Deductions</th>
                  <th className="py-3 px-4 text-right">Net Payout</th>
                  <th className="py-3 px-4 text-center">Headcount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.payrollPeriods.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-text-main">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {p.status}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      {formatCurrency(p.totalGross)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600">
                      -{formatCurrency(p.totalDeductions)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(p.totalNet)}
                    </td>
                    <td className="py-3 px-4 text-center">{p.employeeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
