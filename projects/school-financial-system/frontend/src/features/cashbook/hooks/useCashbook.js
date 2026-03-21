import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../../api/financeApi";

// 1. Hook to fetch and cache the ledger
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: financeApi.getTransactions,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to reduce server load
  });
};

// 2. Hook to submit a payment (Income)
export const useSubmitPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.submitPayment,
    onSuccess: () => {
      // Instantly tell React Query to fetch the fresh ledger from Flask
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

// 3. Hook to submit an expense (Outflow)
export const useSubmitExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.submitExpense,
    onSuccess: () => {
      // Instantly tell React Query to fetch the fresh ledger from Flask
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

// 4. Hook to receive and auto-distribute MoE capitation
export const useReceiveCapitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.receiveCapitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["vote-heads"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
};

// 5. Hook to transfer funds between vote heads
export const useReallocateFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.reallocateFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["vote-heads"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
};

// 6. Hook to fetch vote head allocations
export const useVoteHeads = () => {
  return useQuery({
    queryKey: ["vote-heads"],
    queryFn: financeApi.getVoteHeads,
    staleTime: 1000 * 60 * 2,
  });
};

// 7. Hook to fetch summary totals
export const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: financeApi.getSummary,
    staleTime: 1000 * 60,
  });
};
