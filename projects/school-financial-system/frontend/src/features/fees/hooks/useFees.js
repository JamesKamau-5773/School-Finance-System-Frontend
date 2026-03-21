import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../../api/financeApi";

export const useFeeStructures = (filters) => {
  return useQuery({
    queryKey: ["fee_structures", filters],
    queryFn: () => financeApi.getFeeStructures(filters),
  });
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createFeeStructure,
    onSuccess: () => {
      // Refresh the table when a new levy is created
      queryClient.invalidateQueries({ queryKey: ["fee_structures"] });
    },
  });
};
