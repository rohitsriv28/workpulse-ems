import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2 } from "lucide-react";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("+91 98980 77889");
  const [address, setAddress] = useState(
    "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          My Account Profile
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Review your official employment attributes and manage personal contact
          details.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Personal details updated successfully!
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">{user?.name}</h2>
            <p className="text-xs text-text-muted">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {user?.role} ROLE
              </span>
              <span className="text-xs text-text-muted font-medium">
                {user?.department} • {user?.designation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Read-Only HR Controlled Fields vs Editable Personal Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Read-Only HR Attributes */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-text-main text-sm">
              Employment Details
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Managed by HR
            </span>
          </div>

          <div className="space-y-3 text-slate-600">
            <div>
              <span className="text-text-muted block text-[10px]">
                Employee ID
              </span>
              <span className="font-mono font-bold text-text-main">
                {user?.employeeId || "EMP001"}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px]">
                Department
              </span>
              <span className="font-semibold text-text-main">
                {user?.department || "Engineering"}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px]">
                Designation
              </span>
              <span className="font-semibold text-text-main">
                {user?.designation || "Senior Technical Staff"}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px]">
                Corporate Email
              </span>
              <span className="font-mono text-text-main">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Editable Personal Contact Fields */}
        <form
          onSubmit={handleSave}
          className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-text-main text-sm">
              Personal Contact
            </h3>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Self-Editable
            </span>
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">
              Mobile Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">
              Mailing Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-2xs transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
