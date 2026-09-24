import type { Employee } from "./types";
import { Edit2, Trash2, Mail, BadgeCheck } from "lucide-react";

interface EmployeeListProps {
  data: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-muted font-semibold tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 transition-colors bg-white"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm">
                      {employee.firstName[0]}
                      {employee.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-text-main">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-sm text-text-main">
                    {employee.role === "ADMIN" && (
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    )}
                    {employee.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-text-muted">
                  {employee.department}
                </td>
                <td className="p-4 text-sm text-text-main font-mono">
                  ₹{employee.salary.toLocaleString("en-IN")}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      employee.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : employee.status === "INACTIVE"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-text-muted">
                  {employee.joinDate}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
