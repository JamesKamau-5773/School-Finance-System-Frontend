import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../../../api/financeApi';

export const useInventoryStatus = () => {
  return useQuery({
    queryKey: ['inventory_status'],
    queryFn: financeApi.getInventoryStatus,
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.addStock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory_status'] }),
  });
};

export const useConsumeStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.consumeStock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory_status'] }),
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory_status'] }),
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.updateInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory_status'] }),
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.deleteInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory_status'] }),
  });
};