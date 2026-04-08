import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../../api/financeApi";

const isStudentActive = (student) => {
  if (!student || typeof student !== "object") return false;
  if (student.deleted_at) return false;
  if (student.is_active === false) return false;
  if (typeof student.status === "string") {
    const status = student.status.toLowerCase();
    if (status === "deleted" || status === "inactive") return false;
  }
  return true;
};

const sanitizeDirectoryResponse = (response) => {
  const data = Array.isArray(response?.data) ? response.data : [];
  return {
    ...response,
    data: data.filter(isStudentActive),
  };
};

const removeStudentFromDirectoryResponse = (response, studentId) => {
  if (!response || !Array.isArray(response.data)) return response;

  return {
    ...response,
    data: response.data.filter((student) => student?.id !== studentId),
  };
};

export const useStudentDirectory = (filters = {}) => {
  return useQuery({
    queryKey: ["student_directory", filters],
    queryFn: async () => {
      try {
        const result = await financeApi.getStudentDirectory(filters);
        return sanitizeDirectoryResponse(result);
      } catch (error) {
        console.error('Student directory fetch error:', error);
        // Return empty data structure on error instead of throwing
        return { data: [], message: 'Endpoint not yet available' };
      }
    },
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentLedger = (studentId) => {
  return useQuery({
    queryKey: ["student_ledger", studentId],
    queryFn: async () => {
      const result = await financeApi.getSpecificStudentLedger(studentId);
      console.log(`[Ledger] Student ${studentId}:`, JSON.stringify(result, null, 2));
      if (result?.data) {
        console.log(`[Ledger] Found ${result.data.length} transactions`);
      }
      return result;
    },
    enabled: !!studentId,
    retry: 0,
  });
};

export const useReceivePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData) => {
      console.log('[Payment] Submitting:', JSON.stringify(paymentData, null, 2));
      const response = await financeApi.receiveStudentPayment(paymentData);
      console.log('[Payment] Response:', JSON.stringify(response, null, 2));
      return response;
    },
    onSuccess: (_, variables) => {
      console.log('[Payment] Success! Invalidating ledger for student:', variables.student_id);
      queryClient.invalidateQueries({ queryKey: ["student_ledger", variables.student_id] });
      queryClient.invalidateQueries({ queryKey: ["student_directory"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student_directory"] }),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.updateStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student_directory"] }),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.deleteStudent,
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: ["student_directory"] });

      const previousDirectoryQueries = queryClient.getQueriesData({
        queryKey: ["student_directory"],
      });

      queryClient.setQueriesData(
        { queryKey: ["student_directory"] },
        (current) => removeStudentFromDirectoryResponse(current, studentId),
      );

      return { previousDirectoryQueries };
    },
    onError: (_error, _studentId, context) => {
      context?.previousDirectoryQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["student_directory"] });
    },
  });
};
