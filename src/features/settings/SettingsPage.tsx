import { useState } from "react";
import { Building, Clock, Bell, Lock, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "org" | "policies" | "security" | "notifications"
  >("org");

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          System Settings & Enterprise Configuration
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Configure corporate policies, payroll deduction rules, and account
          security.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        {[
          { id: "org", label: "Organization Profile", icon: Building },
          { id: "policies", label: "Work & Leave Policies", icon: Clock },
          { id: "security", label: "Security & Passwords", icon: Lock },
          { id: "notifications", label: "Notification Channels", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
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

      {savedFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Configuration updated and synchronized successfully!
        </div>
      )}

      {/* Tab 1: Organization Profile */}
      {activeTab === "org" && (
        <form
          onSubmit={handleSave}
          className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-2xl text-xs"
        >
          <h3 className="text-base font-bold text-text-main pb-2 border-b border-slate-100">
            Company Entity Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-main mb-1">
                Legal Entity Name
              </label>
              <input
                defaultValue="EMS Technologies India Pvt Ltd"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-text-main mb-1">
                Tax Identification / PAN
              </label>
              <input
                defaultValue="AABCE1234F"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-main mb-1">
                Default Currency
              </label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="INR">Indian Rupee (INR - ₹)</option>
                <option value="USD">US Dollar (USD - $)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-text-main mb-1">
                Corporate Timezone
              </label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Asia/Kolkata">
                  Asia/Kolkata (IST - UTC+5:30)
                </option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">
              Registered Office Address
            </label>
            <input
              defaultValue="Level 5, Tech Park Innovation Tower, Outer Ring Road, Bengaluru, Karnataka 560103"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              Save Organization Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Work & Leave Policies */}
      {activeTab === "policies" && (
        <form
          onSubmit={handleSave}
          className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-2xl text-xs"
        >
          <h3 className="text-base font-bold text-text-main pb-2 border-b border-slate-100">
            Attendance & Payroll Deduction Rules
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-main mb-1">
                Late Punctuality Grace Period
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={15}
                  className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
                <span className="text-text-muted">
                  minutes after shift start
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">
                Monthly Paid Leave Allowance
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={3}
                  className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
                <span className="text-text-muted">days per calendar month</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 leading-relaxed space-y-1">
            <span className="font-bold block">Payroll Rule Summary:</span>
            <p>• Up to 3 leave days in a month are fully paid.</p>
            <p>
              • Leaves taken beyond 3 days are marked unexcused and deducted
              from monthly salary.
            </p>
            <p>
              • Half-day punches result in a 50% deduction of the daily rate
              (0.5 day penalty).
            </p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              Update Policy Rules
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Passwords */}
      {activeTab === "security" && (
        <form
          onSubmit={handleSave}
          className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-md text-xs"
        >
          <h3 className="text-base font-bold text-text-main pb-2 border-b border-slate-100">
            Account Password & Active Session
          </h3>

          <div>
            <label className="block font-semibold text-text-main mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">
              New Secure Password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-2xs"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 max-w-xl text-xs">
          <h3 className="text-base font-bold text-text-main pb-2 border-b border-slate-100">
            Alert Preferences & Email Digest
          </h3>

          <div className="space-y-3">
            {[
              {
                title: "Leave Decisions",
                desc: "Notify when manager approves or rejects requests.",
              },
              {
                title: "Attendance Exceptions",
                desc: "Alert when a punch is missing or late arrival is recorded.",
              },
              {
                title: "Monthly Payslip Publication",
                desc: "Instant alert when salary slip is ready for download.",
              },
              {
                title: "Company Announcements",
                desc: "Receive official HR circulars and holiday notices.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <span className="font-semibold text-text-main block">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {item.desc}
                  </span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
