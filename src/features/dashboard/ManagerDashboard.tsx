import {
  Users,
  CalendarCheck,
  CheckSquare,
  Award,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { getStore } from "../../lib/api/store";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const store = getStore();

  // Team scope: Engineering employees managed by Rajesh Iyer (EMP003)
  const teamEmployees = store.employees.filter(
    (e) => e.department === "Engineering" && e.id !== "EMP003",
  );
  const teamIds = teamEmployees.map((e) => e.id);

  const teamAttendance = store.attendance.filter(
    (a) => a.date === "2026-09-24" && teamIds.includes(a.employeeId),
  );

  const presentCount = teamAttendance.filter(
    (a) => a.workState === "PRESENT",
  ).length;
  const pendingApprovals = store.leaveRequests.filter(
    (l) => l.status === "PENDING" && teamIds.includes(l.employeeId),
  );

  const teamGoals = store.goals.filter((g) => teamIds.includes(g.employeeId));

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header with clear team badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-main tracking-tight">
              Engineering Team Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              My Team Scope
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Supervisory oversight for 3 direct reports, approvals queue, and
            delivery goals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/leave-approvals")}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
          >
            <CheckSquare className="w-4 h-4" />
            Review Approvals ({pendingApprovals.length})
          </button>
        </div>
      </div>

      {/* Team KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Strength"
          value={teamEmployees.length}
          subtitle="Direct reporting engineers"
          icon={<Users className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/team")}
        />
        <StatCard
          title="Present Today"
          value={`${presentCount} / ${teamEmployees.length}`}
          subtitle="100% active shift status"
          icon={<CalendarCheck className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate("/team-attendance")}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals.length}
          subtitle="Leave & punch requests"
          icon={<CheckSquare className="w-5 h-5 text-amber-600" />}
          onClick={() => navigate("/leave-approvals")}
        />
        <StatCard
          title="Sprint Goals"
          value={`${teamGoals.filter((g) => g.status === "COMPLETED").length} / ${
            teamGoals.length
          }`}
          subtitle="Engineering milestone progress"
          icon={<Award className="w-5 h-5 text-purple-600" />}
          onClick={() => navigate("/performance")}
        />
      </div>

      {/* Main Row: Team Members Live State & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members Status */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-main">
                Team Workday Status (Today)
              </h3>
              <p className="text-xs text-text-muted">
                Live punch activity and work mode for your direct reports
              </p>
            </div>
            <button
              onClick={() => navigate("/team-attendance")}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Full Roster
            </button>
          </div>

          <div className="space-y-3">
            {teamEmployees.map((emp) => {
              const att = teamAttendance.find((a) => a.employeeId === emp.id);
              const isPresent = att?.workState === "PRESENT";
              const lastPunch = att?.events[att.events.length - 1];

              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {emp.firstName[0]}
                      {emp.lastName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-main">
                        {emp.firstName} {emp.lastName}
                      </h4>
                      <p className="text-xs text-text-muted">
                        {emp.designation} • {emp.workMode}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isPresent
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isPresent ? "Checked In" : "Not Punched"}
                    </span>
                    <p className="text-[11px] text-text-muted mt-1 font-mono">
                      {lastPunch
                        ? `Last: ${lastPunch.type} (${lastPunch.timestamp.slice(11, 16)})`
                        : "No punch"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Approvals Widget */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Pending Approvals
                </h3>
                <p className="text-xs text-text-muted">
                  Direct report requests
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {pendingApprovals.length}
              </span>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-text-main">
                    <span>{req.employeeName}</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                      {req.leaveType}
                    </span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-snug">
                    {req.startDate} to {req.endDate} ({req.daysCount} days)
                  </p>
                  <p className="text-slate-600 italic text-[11px] bg-slate-50 p-2 rounded">
                    "{req.reason}"
                  </p>
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => navigate("/leave-approvals")}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Process in Approvals Queue →
                    </button>
                  </div>
                </div>
              ))}

              {pendingApprovals.length === 0 && (
                <div className="text-center py-8 text-text-muted text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All team requests have been reviewed!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/leave-approvals")}
            className="w-full mt-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
          >
            Open Approvals Queue
          </button>
        </div>
      </div>
    </div>
  );
}
