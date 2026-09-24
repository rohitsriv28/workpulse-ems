import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api/client";
import { useAuth } from "../../context/AuthContext";
import type { AttendanceDay } from "../../types";

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceRecord?: AttendanceDay | null;
  onSuccess: () => void;
}

interface CorrectionFormValues {
  date: string;
  checkIn: string;
  checkOut: string;
  reason: string;
}

export function AttendanceCorrectionModal({
  isOpen,
  onClose,
  attendanceRecord,
  onSuccess,
}: AttendanceCorrectionModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorrectionFormValues>({
    defaultValues: {
      date: attendanceRecord?.date || new Date().toISOString().split("T")[0],
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      reason: "",
    },
  });

  const onSubmit = async (data: CorrectionFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await api.submitAttendanceCorrection({
        attendanceId: attendanceRecord?.id || `ATT-${Date.now()}`,
        employeeId: user.employeeId || "EMP004",
        employeeName: user.name,
        date: data.date,
        originalPunch: {
          checkIn:
            attendanceRecord?.events
              .find((e) => e.type === "CHECK_IN")
              ?.timestamp.slice(11, 16) || "Missing",
          checkOut:
            attendanceRecord?.events
              .find((e) => e.type === "CHECK_OUT")
              ?.timestamp.slice(11, 16) || "Missing",
        },
        requestedPunch: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        },
        reason: data.reason,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit correction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Attendance Correction"
      description="Submit a missing punch or time dispute for supervisory and HR review."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-text-main mb-1">
            Workday Date *
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-text-main mb-1">
              Correct Check-In Time *
            </label>
            <input
              {...register("checkIn", { required: "Check-in time required" })}
              placeholder="e.g. 09:00 AM"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold text-text-main mb-1">
              Correct Check-Out Time *
            </label>
            <input
              {...register("checkOut", { required: "Check-out time required" })}
              placeholder="e.g. 06:15 PM"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Reason for Adjustment *
          </label>
          <textarea
            rows={3}
            {...register("reason", {
              required: "Please provide a clear justification",
              minLength: {
                value: 10,
                message: "Reason must be at least 10 characters",
              },
            })}
            placeholder="e.g. Forgot to clock out before leaving; punch verified by manager."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
          {errors.reason && (
            <p className="text-[11px] text-error mt-1">
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
          Approved corrections will adjust official attendance records and
          update monthly payroll deduction records.
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
            className="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Correction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
