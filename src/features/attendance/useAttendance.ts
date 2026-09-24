import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AttendanceRecord, AttendanceStatus } from "./types";
import { format } from "date-fns";

const MOCK_DATA: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Rohit Srivastava",
    department: "Engineering",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: new Date().toISOString(),
    checkOut: null,
    status: "PRESENT",
    totalBreakMinutes: 15,
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Niraj Kapoor",
    department: "HR",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    checkOut: null,
    status: "LATE",
    totalBreakMinutes: 0,
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Amit Shah",
    department: "Sales",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: null,
    checkOut: null,
    status: "ABSENT",
    totalBreakMinutes: 0,
  },
];

export function useAttendance(date: Date) {
  return useQuery({
    queryKey: ["attendance", format(date, "yyyy-MM-dd")],
    queryFn: async (): Promise<AttendanceRecord[]> => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_DATA;
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AttendanceStatus;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
