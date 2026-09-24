import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api/client";
import type { EmploymentStatus, WorkMode, Role } from "../../types";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

interface EmployeeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OnboardingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: Role;
  status: EmploymentStatus;
  joinDate: string;
  workMode: WorkMode;
  salary: number;
  currency: string;
  location: string;
  scheduleId: string;
}

export function EmployeeOnboardingModal({
  isOpen,
  onClose,
  onSuccess,
}: EmployeeOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91 ",
      department: "Engineering",
      designation: "Software Engineer",
      role: "EMPLOYEE",
      status: "ACTIVE",
      joinDate: new Date().toISOString().split("T")[0],
      workMode: "OFFICE",
      salary: 1200000,
      currency: "INR",
      location: "Bengaluru HQ",
      scheduleId: "SCH01",
    },
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["firstName", "lastName", "email", "phone"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["department", "designation", "role", "status"]);
    } else if (currentStep === 3) {
      isValid = await trigger([
        "joinDate",
        "workMode",
        "location",
        "scheduleId",
      ]);
    } else if (currentStep === 4) {
      isValid = await trigger(["salary", "currency"]);
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      await api.createEmployee({
        ...data,
        salary: Number(data.salary),
      });
      reset();
      setCurrentStep(1);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Onboarding failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = getValues();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Onboarding Flow"
      description={`Step ${currentStep} of 5: ${
        currentStep === 1
          ? "Identity & Contact"
          : currentStep === 2
            ? "Role & Department"
            : currentStep === 3
              ? "Work Schedule & Location"
              : currentStep === 4
                ? "Compensation & Benefits"
                : "Review & Confirmation"
      }`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === currentStep
                    ? "bg-primary text-white shadow-xs"
                    : step < currentStep
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              {step < 5 && (
                <div
                  className={`w-6 sm:w-10 h-0.5 rounded ${
                    step < currentStep ? "bg-emerald-300" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Identity */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  First Name *
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="e.g. Aditi"
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {errors.firstName && (
                  <p className="text-[11px] text-error mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Last Name *
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  placeholder="e.g. Verma"
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {errors.lastName && (
                  <p className="text-[11px] text-error mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">
                Corporate Email Address *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="aditi.verma@ems.company.com"
                className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.email && (
                <p className="text-[11px] text-error mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">
                Phone Number *
              </label>
              <input
                {...register("phone", { required: "Phone number is required" })}
                placeholder="+91 98765 43210"
                className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.phone && (
                <p className="text-[11px] text-error mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Role & Department */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Department *
                </label>
                <select
                  {...register("department")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Designation *
                </label>
                <input
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  System Role *
                </label>
                <select
                  {...register("role")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HR">HR Business Partner</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Employment Status *
                </label>
                <select
                  {...register("status")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PROBATION">Probation</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Work Schedule & Mode */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Joining Date *
                </label>
                <input
                  type="date"
                  {...register("joinDate", {
                    required: "Joining date is required",
                  })}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Work Mode *
                </label>
                <select
                  {...register("workMode")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="OFFICE">Onsite (Office)</option>
                  <option value="WFH">Remote (WFH)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Assigned Location *
                </label>
                <input
                  {...register("location")}
                  placeholder="e.g. Bengaluru HQ"
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Shift Schedule *
                </label>
                <select
                  {...register("scheduleId")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="SCH01">General Morning (09:00 - 18:00)</option>
                  <option value="SCH02">Evening Shift (13:00 - 22:00)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Compensation */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Annual Gross Salary *
                </label>
                <input
                  type="number"
                  {...register("salary", {
                    required: "Salary is required",
                    min: { value: 100000, message: "Salary must be > 100,000" },
                  })}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
                {errors.salary && (
                  <p className="text-[11px] text-error mt-1">
                    {errors.salary.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">
                  Currency *
                </label>
                <select
                  {...register("currency")}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold block mb-1">
                Monthly Payroll Formula Note:
              </span>
              Daily Rate is calculated based on calendar days in month. 3 paid
              leaves allowed per month; half-day punches deducted at 50%.
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-text-muted">Full Name</span>
                <span className="font-bold text-text-main">
                  {values.firstName} {values.lastName}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-text-muted">Email</span>
                <span className="font-mono text-text-main">{values.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-text-muted">Department & Role</span>
                <span className="font-semibold text-text-main">
                  {values.department} • {values.designation} ({values.role})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-text-muted">Work Mode</span>
                <span className="font-semibold text-text-main">
                  {values.workMode} ({values.location})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Gross Salary</span>
                <span className="font-bold text-primary">
                  {values.currency} {Number(values.salary).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
              Upon submission, employee profile will be generated, leave
              balances provisioned, and login credentials initialized.
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? "Provisioning Profile..."
                : "Confirm & Onboard Employee"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
