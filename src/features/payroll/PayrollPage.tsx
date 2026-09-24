import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import { getStore } from "../../lib/api/store";
import type { PayrollPeriod, Employee, Payslip } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { Lock, Send, Download, Eye } from "lucide-react";
import { PayslipDetailModal } from "./PayslipDetailModal";

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(
    null,
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const loadData = async () => {
    try {
      const [pData, eData] = await Promise.all([
        api.getPayrollPeriods(),
        api.getEmployees(),
      ]);
      setSelectedPeriod(pData[0] || null);
      setEmployees(eData);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (newStatus: PayrollPeriod["status"]) => {
    if (!selectedPeriod) return;
    if (
      confirm(
        `Are you sure you want to transition ${selectedPeriod.name} to ${newStatus}?`,
      )
    ) {
      const updated = await api.updatePayrollPeriodStatus(
        selectedPeriod.id,
        newStatus,
      );
      setSelectedPeriod(updated);
    }
  };

  const store = getStore();

  const exportPayrollSummaryCSV = () => {
    if (!selectedPeriod) return;
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Gross Salary",
      "Paid Leaves",
      "Unpaid Deductions",
      "Net Payout",
    ];
    const rows = employees.map((e) => {
      return [
        e.id,
        `${e.firstName} ${e.lastName}`,
        e.department,
        Math.round(e.salary / 12),
        "Up to 3 Allowed",
        0,
        Math.round(e.salary / 12),
      ];
    });
    api.exportCSV(`Payroll_${selectedPeriod.period}_Summary`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Payroll Workspace & Finalization
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Monthly salary processing, 3-day paid leave deductions, and payslip
            generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportPayrollSummaryCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export Summary
          </button>
        </div>
      </div>

      {/* Period Selection & Lifecycle Bar */}
      {selectedPeriod && (
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Cycle
              </span>
              <h2 className="text-xl font-bold text-text-main mt-0.5">
                {selectedPeriod.name}
              </h2>
              <p className="text-xs text-text-muted">
                Period Window: {selectedPeriod.startDate} to{" "}
                {selectedPeriod.endDate}
              </p>
            </div>

            {/* Lifecycle Status Pill */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  selectedPeriod.status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedPeriod.status === "LOCKED"
                      ? "bg-purple-100 text-purple-800"
                      : selectedPeriod.status === "REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                }`}
              >
                {selectedPeriod.status}
              </span>

              {selectedPeriod.status === "REVIEW" && (
                <button
                  onClick={() => handleStatusChange("LOCKED")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5" /> Lock & Finalize
                </button>
              )}

              {selectedPeriod.status === "LOCKED" && (
                <button
                  onClick={() => handleStatusChange("PUBLISHED")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" /> Publish Payslips
                </button>
              )}
            </div>
          </div>

          {/* Metric Stats of Period */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-text-muted block text-[10px]">
                Total Gross Pay
              </span>
              <span className="text-base font-bold text-text-main font-mono">
                {formatCurrency(selectedPeriod.totalGross)}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-text-muted block text-[10px]">
                Leave Deductions
              </span>
              <span className="text-base font-bold text-rose-600 font-mono">
                -{formatCurrency(selectedPeriod.totalDeductions)}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-text-muted block text-[10px]">
                Net Payout Cost
              </span>
              <span className="text-base font-bold text-primary font-mono">
                {formatCurrency(selectedPeriod.totalNet)}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-text-muted block text-[10px]">
                Included Headcount
              </span>
              <span className="text-base font-bold text-text-main font-mono">
                {selectedPeriod.employeeCount} Employees
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Employee Breakdown Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-main">
            Employee Salary & Deduction Ledger
          </h3>
          <span className="text-xs text-text-muted">
            Formula: Deductions = (Excess Leaves + HalfDays * 0.5) * DailyRate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-right">Annual Gross</th>
                <th className="py-3.5 px-4 text-right">Monthly Base</th>
                <th className="py-3.5 px-4 text-center">Paid Leaves Used</th>
                <th className="py-3.5 px-4 text-right">Penalty Deductions</th>
                <th className="py-3.5 px-4 text-right">Net Payable</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const monthlyBase = Math.round(emp.salary / 12);
                const dailyRate = Math.round(emp.salary / 365);
                const deduction = emp.status === "ON_LEAVE" ? dailyRate * 2 : 0;
                const net = monthlyBase - deduction;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-text-main block">
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        {emp.employeeNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {emp.department}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {formatCurrency(emp.salary, emp.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-text-main">
                      {formatCurrency(monthlyBase, emp.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[11px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                        {emp.status === "ON_LEAVE" ? "2 / 3" : "0 / 3"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                      {deduction > 0
                        ? `-${formatCurrency(deduction, emp.currency)}`
                        : "₹0"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary">
                      {formatCurrency(net, emp.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          const slip =
                            store.payslips.find(
                              (p) => p.employeeId === emp.id,
                            ) || store.payslips[0];
                          setSelectedPayslip(slip);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Slip Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal */}
      <PayslipDetailModal
        payslip={selectedPayslip}
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
      />
    </div>
  );
}
