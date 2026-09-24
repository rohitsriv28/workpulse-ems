import {
  Users,
  Building,
  Receipt,
  ArrowUpRight,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { getStore } from "../../lib/api/store";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const store = getStore();

  const totalEmployees = store.employees.length;
  const activeEmployees = store.employees.filter(
    (e) => e.status === "ACTIVE",
  ).length;
  const departments = Array.from(
    new Set(store.employees.map((e) => e.department)),
  ).length;
  const currentPayroll = store.payrollPeriods[0];
  const auditLogs = store.auditLogs.slice(0, 5);

  const presentToday = store.attendance.filter(
    (a) => a.workState === "PRESENT" && a.date === "2026-09-24",
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            System & Organization Overview
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Platform health, administrative audit trail, and enterprise
            workforce telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/audit-logs")}
            className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Audit Logs
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
          >
            System Settings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          subtitle={`${activeEmployees} active accounts`}
          trend={{ value: "+8.5%", isPositive: true }}
          icon={<Users className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/employees")}
        />
        <StatCard
          title="Active Departments"
          value={departments}
          subtitle="All business units operational"
          icon={<Building className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/settings")}
        />
        <StatCard
          title="Today's Attendance"
          value={`${presentToday} / ${totalEmployees}`}
          subtitle={`${Math.round((presentToday / totalEmployees) * 100)}% attendance rate`}
          trend={{ value: "+2.1%", isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="Payroll Status"
          value={currentPayroll?.status || "REVIEW"}
          subtitle={`Disbursement: ${formatCurrency(currentPayroll?.totalNet || 0)}`}
          icon={<Receipt className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/payroll")}
        />
      </div>

      {/* Main Grid: Trends & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Telemetry & Headcount */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Department Headcount Distribution
                </h3>
                <p className="text-xs text-text-muted">
                  Employee allocation across organizational functions
                </p>
              </div>
              <button
                onClick={() => navigate("/reports")}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Engineering", count: 4, pct: 57, color: "bg-primary" },
                {
                  name: "Human Resources",
                  count: 1,
                  pct: 14,
                  color: "bg-blue-500",
                },
                { name: "Design", count: 1, pct: 14, color: "bg-purple-500" },
                {
                  name: "Sales & Marketing",
                  count: 1,
                  pct: 14,
                  color: "bg-amber-500",
                },
              ].map((dept, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{dept.name}</span>
                    <span>
                      {dept.count} members ({dept.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.color} rounded-full`}
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health & Security Alerts */}
          <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-semibold text-text-main mb-3">
              Security & Compliance Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Guards Active</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  RBAC enforcement active across all REST endpoints.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>Auth Tokens Hardened</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  HttpOnly rotation with 15-day refresh cycle enabled.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
                <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Audit Trail Active</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Comprehensive audit logs recording all system transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Audit Events */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Recent Audit Events
                </h3>
                <p className="text-xs text-text-muted">
                  Security and state mutations
                </p>
              </div>
              <button
                onClick={() => navigate("/audit-logs")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-primary font-mono text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {log.timestamp.slice(11, 16)}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs truncate">
                    {log.resource}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    By {log.user}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => navigate("/audit-logs")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-text-main text-xs font-semibold rounded-xl transition-colors"
            >
              Inspect Complete Audit Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
