import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../../api/financeApi";

const QUERY_KEYS = {
  transactions: ["transactions"],
  voteHeads: ["vote-heads"],
  summary: ["summary"],
  trialBalance: ["trial_balance"],
};

const invalidateTransactions = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
};

const invalidateDashboardFinancials = (queryClient) => {
  invalidateTransactions(queryClient);
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.voteHeads });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
};

// 1. Hook to fetch and cache the ledger
export const useTransactions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions,
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
      invalidateTransactions(queryClient);
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
      invalidateTransactions(queryClient);
    },
  });
};

// 4. Hook to receive and auto-distribute MoE capitation
export const useReceiveCapitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.receiveCapitation,
    onSuccess: () => {
      invalidateDashboardFinancials(queryClient);
    },
  });
};

// 5. Hook to transfer funds between vote heads
export const useReallocateFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.reallocateFunds,
    onSuccess: () => {
      invalidateDashboardFinancials(queryClient);
    },
  });
};

// 6. Hook to fetch vote head allocations
export const useVoteHeads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.voteHeads,
    queryFn: financeApi.getVoteHeads,
    staleTime: 1000 * 60 * 2,
  });
};

// 7. Hook to fetch summary totals
export const useSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.summary,
    queryFn: financeApi.getSummary,
    staleTime: 1000 * 60,
  });
};

// 8. Hook to fetch trial balance
export const useTrialBalance = () => {
  return useQuery({
    queryKey: QUERY_KEYS.trialBalance,
    queryFn: financeApi.getTrialBalance,
    staleTime: 1000 * 60 * 5,
  });
};
