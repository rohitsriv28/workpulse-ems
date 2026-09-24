import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useEmployees,
  useEmployeeMutations,
} from "../features/employees/useEmployees";
import EmployeeList from "../features/employees/EmployeeList";
import EmployeeForm from "../features/employees/EmployeeForm";
import { Plus, Search, Filter } from "lucide-react";
import type { Employee } from "../features/employees/types";
import type { EmployeeFormData } from "../features/employees/schemas";

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const { addEmployee, updateEmployee, deleteEmployee } =
    useEmployeeMutations();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  // Auto-open modal if query param (?action=add) is present
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setSearchParams({}); // Clear param immediately to avoid loop/re-open on refresh
      handleAdd();
    }
  }, [searchParams, setSearchParams]);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    if (editingEmployee) {
      await updateEmployee.mutateAsync({ id: editingEmployee.id, data });
    } else {
      await addEmployee.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">People</h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your organization's employees
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white w-64"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-text-muted transition-colors cursor-pointer hidden sm:block">
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
        </div>
      </div>

      <EmployeeList
        data={filteredEmployees || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={addEmployee.isPending || updateEmployee.isPending}
        />
      )}
    </div>
  );
}
