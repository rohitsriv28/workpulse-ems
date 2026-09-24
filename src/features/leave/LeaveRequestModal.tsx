import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api/client";
import { useAuth } from "../../context/AuthContext";
import type { LeaveType, LeaveBalance } from "../../types";
import { getStore } from "../../lib/api/store";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LeaveFormValues {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: "MORNING" | "AFTERNOON";
  reason: string;
}

export function LeaveRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: LeaveRequestModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const store = getStore();
  const balance: LeaveBalance = store.leaveBalances[
    user?.employeeId || "EMP004"
  ] || {
    annual: { total: 18, used: 2, available: 16 },
    casual: { total: 12, used: 1, available: 11 },
    sick: { total: 10, used: 0, available: 10 },
    unpaid: 0,
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    defaultValues: {
      leaveType: "CASUAL",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      isHalfDay: false,
      reason: "",
    },
  });

  const selectedType = watch("leaveType");
  const isHalfDay = watch("isHalfDay");

  const onSubmit = async (data: LeaveFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffDays = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1,
      );
      const daysCount = data.isHalfDay ? 0.5 : diffDays;

      await api.createLeaveRequest({
        employeeId: user.employeeId || "EMP004",
        employeeName: user.name,
        department: user.department || "Engineering",
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        daysCount,
        isHalfDay: data.isHalfDay,
        halfDayPeriod: data.halfDayPeriod,
        reason: data.reason,
      });

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit leave:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableDays = () => {
    switch (selectedType) {
      case "ANNUAL":
        return balance.annual.available;
      case "CASUAL":
        return balance.casual.available;
      case "SICK":
        return balance.sick.available;
      case "UNPAID":
        return 99;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      description="Submit a formal leave request for managerial approval."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        {/* Balance Preview Card */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="font-semibold text-blue-900 block">
              Available {selectedType} Balance
            </span>
            <span className="text-[11px] text-blue-700">
              3 paid leaves permitted per calendar month
            </span>
          </div>
          <span className="text-xl font-extrabold text-blue-900">
            {getAvailableDays()} days
          </span>
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Leave Category *
          </label>
          <select
            {...register("leaveType")}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          >
            <option value="CASUAL">Casual Leave (Short Personal Leave)</option>
            <option value="ANNUAL">Annual / Earned Leave (Vacation)</option>
            <option value="SICK">Sick / Medical Leave</option>
            <option value="UNPAID">Loss of Pay / Unpaid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-text-main mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold text-text-main mb-1">
              End Date *
            </label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Half Day Option */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <input
            type="checkbox"
            id="halfDayCheck"
            {...register("isHalfDay")}
            className="w-4 h-4 rounded text-primary focus:ring-primary/20"
          />
          <label
            htmlFor="halfDayCheck"
            className="text-xs font-semibold text-text-main cursor-pointer"
          >
            This is a Half-Day Leave
          </label>
          {isHalfDay && (
            <select
              {...register("halfDayPeriod")}
              className="ml-auto text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1"
            >
              <option value="MORNING">Morning Half</option>
              <option value="AFTERNOON">Afternoon Half</option>
            </select>
          )}
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Reason for Absence *
          </label>
          <textarea
            rows={3}
            {...register("reason", {
              required: "Please state your reason for leave",
              minLength: {
                value: 6,
                message: "Reason must be at least 6 characters",
              },
            })}
            placeholder="e.g. Attending family function; reachable via emergency mobile."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
          {errors.reason && (
            <p className="text-[11px] text-error mt-1">
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? "Submitting Application..."
              : "Submit Leave Application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
