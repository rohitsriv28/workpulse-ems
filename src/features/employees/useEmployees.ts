import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "./types";
import type { EmployeeFormData } from "./schemas";

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    firstName: "Rohit",
    lastName: "Srivastava",
    email: "rohit.srivastava@company.com",
    department: "Engineering",
    role: "MANAGER",
    status: "ACTIVE",
    joinDate: "2022-03-15",
    salary: 1500000,
  },
  {
    id: "EMP002",
    firstName: "Niraj",
    lastName: "Kapoor",
    email: "niraj.kapoor@company.com",
    department: "HR",
    role: "HR",
    status: "ACTIVE",
    joinDate: "2021-06-01",
    salary: 800000,
  },
  {
    id: "EMP003",
    firstName: "Amit",
    lastName: "Shah",
    email: "amit.shah@company.com",
    department: "Sales",
    role: "EMPLOYEE",
    status: "ON_LEAVE",
    joinDate: "2023-01-10",
    salary: 500000,
  },
  {
    id: "EMP004",
    firstName: "Kiara",
    lastName: "Advani",
    email: "kiara.advani@company.com",
    department: "Marketing",
    role: "EMPLOYEE",
    status: "ACTIVE",
    joinDate: "2023-05-20",
    salary: 600000,
  },
];

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async (): Promise<Employee[]> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [...MOCK_EMPLOYEES];
    },
  });
}

export function useEmployeeMutations() {
  const queryClient = useQueryClient();

  const addEmployee = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id: `EMP${Math.floor(Math.random() * 1000)}`, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: EmployeeFormData;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return { addEmployee, updateEmployee, deleteEmployee };
}
