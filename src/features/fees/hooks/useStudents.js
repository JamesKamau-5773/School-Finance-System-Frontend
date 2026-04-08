import { useQuery } from "@tanstack/react-query";
import { financeApi } from "../../../api/financeApi";

export const useStudentDirectory = (filters) => {
  return useQuery({
    queryKey: ["student_directory", filters],
    queryFn: () => financeApi.getStudentDirectory(filters),
    keepPreviousData: true, // Prevents UI flickering while typing in the search bar
  });
};


export const useStudentLedger = (studentId) => {
  return useQuery({
    queryKey: ['student_ledger', studentId],
    // We will build this Flask endpoint in the next step
    queryFn: () => financeApi.getSpecificStudentLedger(studentId),
    enabled: !!studentId, // Only run if a student is actually selected
  });
};