import { Users, UserCheck, UserX, Clock } from "lucide-react";
import type { AttendanceRecord } from "./types";

interface AttendanceStatsProps {
  data: AttendanceRecord[];
}

export default function AttendanceStats({ data }: AttendanceStatsProps) {
  const total = data.length;
  const present = data.filter((r) => r.status === "PRESENT").length;
  const absent = data.filter((r) => r.status === "ABSENT").length;
  const late = data.filter((r) => r.status === "LATE").length;

  const stats = [
    {
      label: "Total Employess",
      value: total,
      icon: Users,
      color: "text-primary",
      bg: "bg-blue-50",
    },
    {
      label: "Present",
      value: present,
      icon: UserCheck,
      color: "text-success",
      bg: "bg-green-50",
    },
    {
      label: "Absent",
      value: absent,
      icon: UserX,
      color: "text-error",
      bg: "bg-red-50",
    },
    {
      label: "Late Arrival",
      value: late,
      icon: Clock,
      color: "text-accent",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-surface p-4 rounded-xl shadow-sm border border-gray-100 flex items-center"
        >
          <div className={`${stat.bg} p-3 rounded-full mr-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            <p className="text-2xl font-bold text-text-main">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
