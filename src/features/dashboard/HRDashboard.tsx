import {
  CalendarCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  Receipt,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { getStore } from "../../lib/api/store";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../lib/utils";

export default function HRDashboard() {
  const navigate = useNavigate();
  const store = getStore();

  const totalEmployees = store.employees.length;
  const pendingLeaves = store.leaveRequests.filter(
    (l) => l.status === "PENDING",
  );
  const pendingCorrections = store.corrections.filter(
    (c) => c.status === "PENDING",
  );

  const todayAttendance = store.attendance.filter(
    (a) => a.date === "2026-09-24",
  );
  const presentCount = todayAttendance.filter(
    (a) => a.workState === "PRESENT",
  ).length;
  const lateCount = todayAttendance.filter((a) => a.punctuality.isLate).length;
  const currentPayroll = store.payrollPeriods[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            HR Operations Center
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Workforce attendance tracking, operational exceptions, and monthly
            payroll execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/employees")}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
          <button
            onClick={() => navigate("/payroll")}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Receipt className="w-4 h-4 text-primary" />
            Payroll Run
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present Today"
          value={`${presentCount} / ${totalEmployees}`}
          subtitle={`${Math.round((presentCount / totalEmployees) * 100)}% roster attendance`}
          icon={<CalendarCheck className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="Late Arrivals"
          value={lateCount}
          subtitle="Arrived after 15m grace"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length + pendingCorrections.length}
          subtitle={`${pendingLeaves.length} leaves, ${pendingCorrections.length} corrections`}
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
          onClick={() => navigate("/leave")}
        />
        <StatCard
          title="Payroll Period"
          value={currentPayroll?.name || "Sep 2026"}
          subtitle={`Status: ${currentPayroll?.status}`}
          icon={<Receipt className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/payroll")}
        />
      </div>

      {/* Prominent "Needs Attention" Exception Queue */}
      <div className="bg-surface rounded-2xl p-6 border-2 border-amber-200/80 shadow-xs bg-gradient-to-br from-amber-50/20 via-surface to-surface">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-main">
                Needs Attention Queue
              </h2>
              <p className="text-xs text-text-muted">
                Critical workforce items awaiting your verification and sign-off
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {pendingLeaves.length + pendingCorrections.length + lateCount}{" "}
            Urgent Action Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Leaves Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Leave Applications
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {pendingLeaves.length} Pending
                </span>
              </div>
              <p className="text-sm font-bold text-text-main">
                {pendingLeaves[0]?.employeeName || "No pending leaves"}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {pendingLeaves[0]
                  ? `${pendingLeaves[0].daysCount} days of ${pendingLeaves[0].leaveType} leave requested`
                  : "All leave applications have been reviewed."}
              </p>
            </div>
            <button
              onClick={() => navigate("/leave")}
              className="mt-4 flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-slate-100"
            >
              <span>Review Leave Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pending Attendance Corrections Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Attendance Corrections
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {pendingCorrections.length} Pending
                </span>
              </div>
              <p className="text-sm font-bold text-text-main">
                {pendingCorrections[0]?.employeeName ||
                  "No corrections pending"}
              </p>
              <p className="text-xs text-text-muted mt-1 truncate">
                {pendingCorrections[0]?.reason ||
                  "No missing punch disputes logged."}
              </p>
            </div>
            <button
              onClick={() => navigate("/attendance")}
              className="mt-4 flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-slate-100"
            >
              <span>Review Correction Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Payroll Execution Ready Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Payroll Cycle
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {currentPayroll?.status}
                </span>
              </div>
              <p className="text-sm font-bold text-text-main">
                {currentPayroll?.name} Cycle
              </p>
              <p className="text-xs text-text-muted mt-1">
                Net Payout: {formatCurrency(currentPayroll?.totalNet || 0)}{" "}
                across {currentPayroll?.employeeCount} employees.
              </p>
            </div>
            <button
              onClick={() => navigate("/payroll")}
              className="mt-4 flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-slate-100"
            >
              <span>Finalize & Lock Payroll</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Roster Activity */}
      <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-main">
              Today's Live Attendance Feed
            </h3>
            <p className="text-xs text-text-muted">
              Realtime clock-ins, punch activity, and exceptions
            </p>
          </div>
          <button
            onClick={() => navigate("/attendance")}
            className="text-xs text-primary font-semibold hover:underline"
          >
            View Full Table
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">First Punch</th>
                <th className="py-3 px-4">Status & Exceptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-text-main">
                    {rec.employeeName}
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {rec.department}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {rec.workMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {rec.events[0]?.timestamp.slice(11, 16) || "--:--"}
                  </td>
                  <td className="py-3 px-4">
                    {rec.punctuality.isLate && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mr-2">
                        Late {rec.punctuality.lateMinutes}m
                      </span>
                    )}
                    {rec.exceptions.map((ex, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full mr-1"
                      >
                        {ex}
                      </span>
                    ))}
                    {!rec.punctuality.isLate && rec.exceptions.length === 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
