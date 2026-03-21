import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { financeApi } from './financeApi';

describe('financeApi.getTrialBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the preferred trial balance endpoint and returns response data', async () => {
    const mockData = {
      lines: [{ account: 'CASH_IN_BANK', debit: 1200, credit: 0 }],
      totals: { debit: 1200, credit: 1200, is_balanced: true },
    };

    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await financeApi.getTrialBalance();

    expect(apiClient.get).toHaveBeenCalledWith('/api/finance/reports/trial-balance');
    expect(result).toEqual(mockData);
  });

  it('falls back to legacy trial balance endpoint when preferred endpoint returns client error', async () => {
    const mockData = {
      lines: [{ account: 'BANK', debit: 500, credit: 0 }],
      totals: { debit: 500, credit: 500, is_balanced: true },
    };

    apiClient.get
      .mockRejectedValueOnce({ response: { status: 400 } })
      .mockResolvedValueOnce({ data: mockData });

    const result = await financeApi.getTrialBalance();

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/finance/reports/trial-balance');
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/finance/trial-balance');
    expect(result).toEqual(mockData);
  });
});

describe('financeApi.getAccountLedger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the account ledger endpoint with encoded account name', async () => {
    const ledger = [{ date: '2026-01-01', debit: 100, credit: 0 }];
    apiClient.get.mockResolvedValue({ data: ledger });

    const result = await financeApi.getAccountLedger('CASH IN BANK');

    expect(apiClient.get).toHaveBeenCalledWith('/api/finance/ledger/CASH%20IN%20BANK');
    expect(result).toEqual(ledger);
  });
});
