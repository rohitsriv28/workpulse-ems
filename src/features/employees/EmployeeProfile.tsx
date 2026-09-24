import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import type { Employee, LeaveBalance } from "../../types";
import { getStore } from "../../lib/api/store";
import {
  formatCurrency,
  formatDate,
  formatMinutesDuration,
} from "../../lib/utils";
import {
  User,
  CalendarCheck,
  CalendarOff,
  Receipt,
  FolderOpen,
  Award,
} from "lucide-react";

interface EmployeeProfileProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function EmployeeProfile({
  employee,
  isOpen,
  onClose,
  onUpdate: _onUpdate,
}: EmployeeProfileProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendance" | "leave" | "compensation" | "documents" | "goals"
  >("overview");

  if (!isOpen || !employee) return null;

  const store = getStore();
  const attendanceList = store.attendance.filter(
    (a) => a.employeeId === employee.id,
  );
  const leaveBalance: LeaveBalance = store.leaveBalances[employee.id] || {
    annual: { total: 18, used: 2, available: 16 },
    casual: { total: 12, used: 1, available: 11 },
    sick: { total: 10, used: 0, available: 10 },
    unpaid: 0,
  };
  const documents = store.documents.filter((d) => d.employeeId === employee.id);
  const goals = store.goals.filter((g) => g.employeeId === employee.id);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "leave", label: "Leave", icon: CalendarOff },
    { id: "compensation", label: "Compensation", icon: Receipt },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "goals", label: "Goals", icon: Award },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${employee.firstName} ${employee.lastName}`}
      description={`${employee.designation} • ${employee.department} • ${employee.employeeNumber}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-text-main">
                  {employee.firstName} {employee.lastName}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    employee.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {employee.email} • {employee.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-xs">
            <span className="text-text-muted">Work Mode</span>
            <span className="font-semibold text-text-main">
              {employee.workMode} ({employee.location})
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">
                Employment Attributes
              </span>
              <div className="flex justify-between">
                <span className="text-text-muted">Joined Date:</span>
                <span className="font-semibold text-text-main">
                  {formatDate(employee.joinDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Reporting Manager:</span>
                <span className="font-semibold text-text-main">
                  {employee.managerName || "Vikram Malhotra (CTO)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Assigned Shift:</span>
                <span className="font-semibold text-text-main">
                  General Morning (09:00 - 18:00)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">
                Account Credentials
              </span>
              <div className="flex justify-between">
                <span className="text-text-muted">System Role:</span>
                <span className="font-semibold text-text-main">
                  {employee.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Work Email:</span>
                <span className="font-mono text-text-main">
                  {employee.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-text-muted block">
              Recent Attendance History ({attendanceList.length} recorded days)
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {attendanceList.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs"
                >
                  <div>
                    <span className="font-semibold text-text-main block">
                      {formatDate(a.date)}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {a.workMode} • {formatMinutesDuration(a.workedMinutes)}{" "}
                      logged
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        a.workState === "PRESENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {a.workState}
                    </span>
                    {a.punctuality.isLate && (
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        Late {a.punctuality.lateMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leave" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                <span className="text-[10px] text-blue-700 font-semibold block uppercase">
                  Annual
                </span>
                <span className="text-lg font-bold text-blue-900">
                  {leaveBalance.annual.available}d left
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                <span className="text-[10px] text-purple-700 font-semibold block uppercase">
                  Casual
                </span>
                <span className="text-lg font-bold text-purple-900">
                  {leaveBalance.casual.available}d left
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-700 font-semibold block uppercase">
                  Sick
                </span>
                <span className="text-lg font-bold text-emerald-900">
                  {leaveBalance.sick.available}d left
                </span>
              </div>
            </div>
            <p className="text-text-muted text-[11px] text-center">
              Official corporate allowance: 3 paid leaves allowed per month
              without salary penalty.
            </p>
          </div>
        )}

        {activeTab === "compensation" && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-text-muted">Annual Gross CTC</span>
              <span className="text-base font-bold text-primary">
                {formatCurrency(employee.salary, employee.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-text-muted">Calculated Monthly Gross</span>
              <span className="font-semibold text-text-main">
                {formatCurrency(
                  Math.round(employee.salary / 12),
                  employee.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Est. Daily Working Rate</span>
              <span className="font-semibold text-text-main">
                {formatCurrency(
                  Math.round(employee.salary / 365),
                  employee.currency,
                )}{" "}
                / day
              </span>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-2 text-xs">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white"
              >
                <div>
                  <span className="font-semibold text-text-main block">
                    {doc.name}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {doc.category} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {doc.status}
                </span>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-center py-6 text-text-muted">
                No documents uploaded.
              </p>
            )}
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-3 text-xs">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl border border-slate-100 bg-white space-y-2"
              >
                <div className="flex justify-between items-center font-semibold text-text-main">
                  <span>{g.title}</span>
                  <span className="text-primary font-bold">{g.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <p className="text-text-muted text-[11px]">{g.description}</p>
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-center py-6 text-text-muted">
                No active goals found.
              </p>
            )}
          </div>
        )}

        {/* Modal Close Action */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl"
          >
            Close Profile
          </button>
        </div>
      </div>
    </Modal>
  );
}
