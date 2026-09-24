import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { Holiday } from "../../types";
import { MapPin } from "lucide-react";
import { formatDate } from "../../lib/utils";

export default function HolidayCalendarPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    async function load() {
      const data = await api.getHolidays();
      setHolidays(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          Corporate Holiday Calendar 2026
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Official mandatory public holidays, optional religious observances,
          and non-working days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((hol) => (
          <div
            key={hol.id}
            className="bg-surface rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {formatDate(hol.date, "EEEE")}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hol.type === "PUBLIC"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {hol.type} HOLIDAY
                </span>
              </div>

              <h3 className="text-base font-bold text-text-main mb-1">
                {hol.name}
              </h3>
              <p className="text-xs font-semibold text-text-muted font-mono">
                {formatDate(hol.date, "MMMM dd, yyyy")}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {hol.locations.join(", ")}
              </span>
              <span className="font-semibold text-emerald-700">
                Office Closed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
