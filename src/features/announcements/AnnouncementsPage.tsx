import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { Announcement } from "../../types";
import { formatDate } from "../../lib/utils";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function load() {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          Company Announcements & Notices
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Official workforce updates, holiday circulars, and quarterly executive
          notices.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    a.priority === "URGENT"
                      ? "bg-rose-100 text-rose-800"
                      : a.priority === "HOLIDAY"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {a.priority} NOTICE
                </span>
                <span className="text-xs text-text-muted">
                  Audience: {a.targetRole}
                </span>
              </div>
              <span className="text-xs text-text-muted font-mono">
                Published {formatDate(a.createdAt)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-text-main">{a.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {a.content}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
              <span>
                Authorized By:{" "}
                <strong className="text-text-main">{a.author}</strong>
              </span>
              <span className="text-emerald-700 font-semibold">
                Official Circular
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
