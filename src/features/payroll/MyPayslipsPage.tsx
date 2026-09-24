import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { Payslip } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { Eye } from "lucide-react";
import { PayslipDetailModal } from "./PayslipDetailModal";

export default function MyPayslipsPage() {
  const { user } = useAuth();
  const empId = user?.employeeId || "EMP004";

  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getPayslips(empId);
      setPayslips(data);
      setLoading(false);
    }
    load();
  }, [empId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          My Monthly Payslips
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Historical salary disbursements, itemized deductions, and downloadable
          PDF slips.
        </p>
      </div>

      {/* Payslip Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payslips.map((slip) => (
          <div
            key={slip.id}
            className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {slip.periodName}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {slip.status}
                </span>
              </div>

              <div className="flex justify-between items-baseline mb-4">
                <div>
                  <span className="text-xs text-text-muted block">
                    Net Take-Home
                  </span>
                  <span className="text-2xl font-black text-text-main font-mono">
                    {formatCurrency(slip.netPay)}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="text-text-muted block">Gross Payout</span>
                  <span className="font-semibold text-slate-700 font-mono">
                    {formatCurrency(slip.grossPay)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Attendance Days:</span>
                  <span className="font-semibold text-text-main">
                    {slip.attendanceSummary.presentDays} /{" "}
                    {slip.attendanceSummary.totalDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Disbursed On:</span>
                  <span className="font-semibold text-text-main">
                    {slip.payDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Account:</span>
                  <span className="font-mono text-text-main">
                    {slip.bankAccount}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                Ref: {slip.id}
              </span>
              <button
                onClick={() => setSelectedSlip(slip)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Breakdown</span>
              </button>
            </div>
          </div>
        ))}

        {payslips.length === 0 && !loading && (
          <div className="col-span-2 p-10 bg-surface rounded-2xl border border-dashed border-slate-200 text-center text-xs text-text-muted">
            No published payslips found for your account.
          </div>
        )}
      </div>

      {/* Payslip Detail & Print Modal */}
      <PayslipDetailModal
        payslip={selectedSlip}
        isOpen={!!selectedSlip}
        onClose={() => setSelectedSlip(null)}
      />
    </div>
  );
}
