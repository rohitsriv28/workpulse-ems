import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import type { Role } from "../../types";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@ems.company.com");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your corporate email.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, selectedRole);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: Role, demoEmail: string) => {
    setEmail(demoEmail);
    setSelectedRole(role);
    setIsSubmitting(true);
    try {
      await login(demoEmail, role);
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/src/assets/attendlogo.png"
          alt="EMS Logo"
          className="mx-auto h-12 w-auto object-contain"
        />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
          EMS Enterprise Workforce
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted">
          Enterprise Employee Management, Attendance & Payroll Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Quick Demo Selector */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
              Quick One-Click Sign In (Choose Persona)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("ADMIN", "admin@ems.company.com")
                }
                className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold rounded-xl border border-purple-200 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold">Admin Portal</div>
                <div className="text-[10px] text-purple-600">CTO Overview</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("HR", "hr@ems.company.com")}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-xl border border-blue-200 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold">HR Partner</div>
                <div className="text-[10px] text-blue-600">
                  Operations & Pay
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("MANAGER", "manager@ems.company.com")
                }
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-xl border border-amber-200 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold">Team Manager</div>
                <div className="text-[10px] text-amber-600">
                  Approvals & Team
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("EMPLOYEE", "employee@ems.company.com")
                }
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-200 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold">Employee</div>
                <div className="text-[10px] text-emerald-600">
                  Punch & Payslips
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Or Sign In with Email
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ems.company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-main">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>
                {isSubmitting ? "Authenticating..." : "Sign In to Workspace"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
