import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../api/financeApi', () => ({
  financeApi: {
    getTransactions: vi.fn(),
    submitPayment: vi.fn(),
    submitExpense: vi.fn(),
    receiveCapitation: vi.fn(),
    reallocateFunds: vi.fn(),
    getVoteHeads: vi.fn(),
    getSummary: vi.fn(),
    getTrialBalance: vi.fn(),
  },
}));

import { financeApi } from '../../../api/financeApi';
import { useTrialBalance } from './useCashbook';

describe('useTrialBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches trial balance data with the expected query key', async () => {
    const mockData = {
      lines: [{ account: 'BANK', debit: 5000, credit: 0 }],
      totals: { debit: 5000, credit: 5000, is_balanced: true },
    };

    financeApi.getTrialBalance.mockResolvedValue(mockData);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useTrialBalance(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(financeApi.getTrialBalance).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryCache().getAll()[0].queryKey).toEqual(['trial_balance']);
    expect(result.current.data).toEqual(mockData);
  });
});
