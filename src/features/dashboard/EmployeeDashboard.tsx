import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarCheck,
  Clock,
  Coffee,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getStore } from "../../lib/api/store";
import { api } from "../../lib/api/client";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatMinutesDuration } from "../../lib/utils";
import type { AttendanceDay } from "../../types";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const empId = user?.employeeId || "EMP004";

  const [todayRecord, setTodayRecord] = useState<AttendanceDay | null>(null);
  const [isPunching, setIsPunching] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  const store = getStore();
  const balance = store.leaveBalances[empId] || {
    annual: { total: 18, used: 3, available: 15 },
    casual: { total: 12, used: 2, available: 10 },
    sick: { total: 10, used: 1, available: 9 },
    unpaid: 0,
  };

  const nextHoliday = store.holidays[0];
  const latestPayslip =
    store.payslips.find((p) => p.employeeId === empId) || store.payslips[0];

  useEffect(() => {
    async function loadToday() {
      const rec = await api.getTodayAttendance(empId);
      setTodayRecord(rec);
    }
    loadToday();
  }, [empId]);

  const handlePunch = async (
    type: "CHECK_IN" | "CHECK_OUT" | "BREAK_START" | "BREAK_END",
  ) => {
    setIsPunching(true);
    setPunchFeedback(null);
    try {
      const updated = await api.recordTimeEvent(empId, type);
      setTodayRecord(updated);
      setPunchFeedback(
        type === "CHECK_IN"
          ? "Successfully Checked In for today!"
          : type === "CHECK_OUT"
            ? "Checked Out! Good job today."
            : type === "BREAK_START"
              ? "Break started. Take your time to recharge!"
              : "Break ended. Welcome back!",
      );
      setTimeout(() => setPunchFeedback(null), 4000);
    } finally {
      setIsPunching(false);
    }
  };

  // Determine current punch state
  const hasCheckedIn = todayRecord?.events.some((e) => e.type === "CHECK_IN");
  const hasCheckedOut = todayRecord?.events.some((e) => e.type === "CHECK_OUT");
  const onBreak =
    hasCheckedIn &&
    !hasCheckedOut &&
    todayRecord?.events.length &&
    todayRecord.events[todayRecord.events.length - 1].type === "BREAK_START";

  const checkInTime = todayRecord?.events.find(
    (e) => e.type === "CHECK_IN",
  )?.timestamp;
  const checkOutTime = todayRecord?.events.find(
    (e) => e.type === "CHECK_OUT",
  )?.timestamp;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Workday Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-text-muted mt-1">
            General Morning Shift • 09:00 AM – 06:00 PM • {user?.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Work Mode: WFH (Remote)
          </span>
        </div>
      </div>

      {/* Primary Workday Action Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden bg-gradient-to-r from-slate-50 via-white to-blue-50/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Workday Session
              </span>
              <span className="text-xs text-text-muted">• Sep 24, 2026</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
                {hasCheckedOut
                  ? "Workday Completed"
                  : onBreak
                    ? "On Break"
                    : hasCheckedIn
                      ? "Checked In & Active"
                      : "Ready to Start Workday"}
              </span>
            </div>

            <p className="text-sm text-text-muted max-w-lg">
              {hasCheckedOut
                ? `Logged out at ${checkOutTime?.slice(11, 16)}. Total worked duration: ${formatMinutesDuration(
                    todayRecord?.workedMinutes || 480,
                  )}.`
                : hasCheckedIn
                  ? `Punched in at ${checkInTime?.slice(11, 16)}. Standard workday ends at 06:00 PM.`
                  : "Clock in using the action button below to record your official attendance."}
            </p>

            {punchFeedback && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3.5 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {punchFeedback}
              </div>
            )}
          </div>

          {/* Interactive Punch Action Group */}
          <div className="flex flex-wrap items-center gap-3">
            {!hasCheckedIn && (
              <button
                onClick={() => handlePunch("CHECK_IN")}
                disabled={isPunching}
                className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Check In Now</span>
              </button>
            )}

            {hasCheckedIn && !hasCheckedOut && (
              <>
                {!onBreak ? (
                  <button
                    onClick={() => handlePunch("BREAK_START")}
                    disabled={isPunching}
                    className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Take a Break</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePunch("BREAK_END")}
                    disabled={isPunching}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Resume Work</span>
                  </button>
                )}

                <button
                  onClick={() => handlePunch("CHECK_OUT")}
                  disabled={isPunching}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Clock className="w-5 h-5" />
                  <span>Check Out</span>
                </button>
              </>
            )}

            {hasCheckedOut && (
              <button
                onClick={() => navigate("/my-attendance")}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-2xl transition-all flex items-center gap-2"
              >
                <span>View Attendance Log</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar of Daily Work */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-text-muted block mb-0.5">Shift Window</span>
            <span className="font-semibold text-text-main">
              09:00 AM – 06:00 PM
            </span>
          </div>
          <div>
            <span className="text-text-muted block mb-0.5">Time Logged</span>
            <span className="font-semibold text-text-main font-mono">
              {formatMinutesDuration(
                todayRecord?.workedMinutes || (hasCheckedIn ? 380 : 0),
              )}
            </span>
          </div>
          <div>
            <span className="text-text-muted block mb-0.5">Break Taken</span>
            <span className="font-semibold text-text-main font-mono">
              {todayRecord?.breakMinutes || 0} minutes
            </span>
          </div>
          <div>
            <span className="text-text-muted block mb-0.5">Punctuality</span>
            <span className="font-semibold text-emerald-700">
              {todayRecord?.punctuality.isLate
                ? `Late ${todayRecord.punctuality.lateMinutes}m`
                : "On Time (09:05 AM)"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Leave Balances, Next Holiday & Latest Payslip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leave Balance Snapshot */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Leave Balances
                </h3>
                <p className="text-xs text-text-muted">
                  Paid leave entitlements 2026
                </p>
              </div>
              <button
                onClick={() => navigate("/my-leave")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">
                    Annual Leave
                  </span>
                  <span className="text-[11px] text-blue-700">
                    {balance.annual.used} used of {balance.annual.total} days
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-900">
                  {balance.annual.available}d
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-900 block">
                    Casual Leave
                  </span>
                  <span className="text-[11px] text-purple-700">
                    {balance.casual.used} used of {balance.casual.total} days
                  </span>
                </div>
                <span className="text-xl font-bold text-purple-900">
                  {balance.casual.available}d
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-900 block">
                    Sick Leave
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    {balance.sick.used} used of {balance.sick.total} days
                  </span>
                </div>
                <span className="text-xl font-bold text-emerald-900">
                  {balance.sick.available}d
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/my-leave")}
            className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl transition-colors"
          >
            Manage Leave Requests
          </button>
        </div>

        {/* Latest Payslip Summary */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Latest Payslip
                </h3>
                <p className="text-xs text-text-muted">
                  {latestPayslip?.periodName} (Disbursed)
                </p>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                PAID
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50/40 border border-primary/20 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-text-muted">Net Disbursed</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(latestPayslip?.netPay || 113333)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Gross Compensation</span>
                  <span className="font-semibold text-text-main">
                    {formatCurrency(latestPayslip?.grossPay || 133333)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Taxes & Deductions</span>
                  <span className="font-semibold">
                    -{formatCurrency(latestPayslip?.totalDeductions || 20000)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-text-muted pt-1">
                  <span>Paid on: {latestPayslip?.payDate}</span>
                  <span>A/c: {latestPayslip?.bankAccount}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/my-payslips")}
            className="w-full mt-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
          >
            Download Payslip PDF
          </button>
        </div>

        {/* Upcoming Holidays & Announcements */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Upcoming Holiday
                </h3>
                <p className="text-xs text-text-muted">
                  Corporate calendar off-days
                </p>
              </div>
              <button
                onClick={() => navigate("/holidays")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">
                    {nextHoliday.name}
                  </h4>
                  <p className="text-xs text-amber-900 font-semibold mt-0.5">
                    Friday, October 2nd, 2026
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Official 3-Day Long Weekend
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-text-main block">
                Announcement Note
              </span>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Offices will remain closed on Oct 2nd. Ensure all shift
                handovers are coordinated before Thursday 6 PM.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/holidays")}
            className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl transition-colors"
          >
            View All Holidays
          </button>
        </div>
      </div>
    </div>
  );
}
