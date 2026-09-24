import { Modal } from "../../components/ui/Modal";
import type { Payslip } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { Printer } from "lucide-react";

interface PayslipDetailModalProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipDetailModal({
  payslip,
  isOpen,
  onClose,
}: PayslipDetailModalProps) {
  if (!isOpen || !payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Slip — ${payslip.periodName}`}
      description={`Disbursement Reference: ${payslip.id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-text-main" id="printable-payslip">
        {/* Company Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/attendlogo.png"
              alt="EMS Logo"
              className="h-9 w-auto object-contain"
            />
            <div>
              <h3 className="font-bold text-sm text-text-main">
                EMS Technologies India Pvt Ltd
              </h3>
              <p className="text-[11px] text-text-muted">
                Bengaluru HQ • Karnataka, India • PAN: AABCE1234F
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            CONFIRMED & PAID
          </span>
        </div>

        {/* Employee & Bank Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] text-text-muted block">
              Employee Name:
            </span>
            <span className="font-bold">{payslip.employeeName}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              Employee Number:
            </span>
            <span className="font-bold font-mono">{payslip.employeeId}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              Department:
            </span>
            <span className="font-semibold">{payslip.department}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              Designation:
            </span>
            <span className="font-semibold">{payslip.designation}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              PAN / Tax ID:
            </span>
            <span className="font-mono font-semibold">{payslip.panNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              Bank Account:
            </span>
            <span className="font-mono font-semibold">
              {payslip.bankAccount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">Pay Date:</span>
            <span className="font-semibold">{payslip.payDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block">
              Joining Date:
            </span>
            <span className="font-semibold">{payslip.joinDate}</span>
          </div>
        </div>

        {/* Attendance Summary Bar */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
          <div>
            <span className="text-blue-700 block">Total Days</span>
            <span className="font-bold text-blue-950">
              {payslip.attendanceSummary.totalDays} Days
            </span>
          </div>
          <div>
            <span className="text-blue-700 block">Present / WFH</span>
            <span className="font-bold text-blue-950">
              {payslip.attendanceSummary.presentDays} Days
            </span>
          </div>
          <div>
            <span className="text-blue-700 block">Paid Leaves Used</span>
            <span className="font-bold text-blue-950">
              {payslip.attendanceSummary.paidLeavesUsed} (Max 3)
            </span>
          </div>
          <div>
            <span className="text-blue-700 block">Unpaid Penalties</span>
            <span className="font-bold text-rose-700">
              {payslip.attendanceSummary.unpaidLeaves} Days
            </span>
          </div>
        </div>

        {/* Earnings & Deductions Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-text-main text-xs pb-1 border-b border-slate-100 uppercase tracking-wider text-slate-500">
              Earnings
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Basic Salary</span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.basicSalary)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">
                House Rent Allowance (HRA)
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.hra)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Special Allowances</span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.allowances)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-emerald-800">
              <span>Gross Earnings</span>
              <span className="font-mono">
                {formatCurrency(payslip.grossPay)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-text-main text-xs pb-1 border-b border-slate-100 uppercase tracking-wider text-slate-500">
              Deductions
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Provident Fund (PF)</span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.pfDeduction)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Income Tax (TDS)</span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.taxDeduction)}
              </span>
            </div>
            <div className="flex justify-between py-1 text-rose-600">
              <span>Attendance / Leave Penalties</span>
              <span className="font-mono font-semibold">
                {formatCurrency(payslip.leaveDeductions)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-rose-800">
              <span>Total Deductions</span>
              <span className="font-mono">
                {formatCurrency(payslip.totalDeductions)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Salary Total */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs uppercase tracking-wider opacity-80 block">
              Net Take-Home Salary
            </span>
            <span className="text-xs opacity-90">
              Deposited via Direct Bank Transfer
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">
            {formatCurrency(payslip.netPay)}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 print:hidden">
          <p className="text-[11px] text-text-muted">
            This is a system-generated payslip under official company seal.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-xl text-xs hover:bg-primary-hover cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
