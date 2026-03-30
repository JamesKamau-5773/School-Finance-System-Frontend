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

describe('financeApi.getFeeStructures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the preferred fee structures endpoint with params', async () => {
    const mockData = { data: [{ id: 1, name: 'Lunch Program' }] };
    const filters = { academic_year: '2026', term: 'Term 1' };

    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await financeApi.getFeeStructures(filters);

    expect(apiClient.get).toHaveBeenCalledWith('/api/fees/structures', { params: filters });
    expect(result).toEqual(mockData);
  });

  it('falls back to finance-prefixed endpoint when preferred endpoint is missing', async () => {
    const mockData = { data: [{ id: 2, name: 'Transport' }] };

    apiClient.get
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ data: mockData });

    const result = await financeApi.getFeeStructures();

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/api/fees/structures', { params: {} });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/api/finance/fees/structures', { params: {} });
    expect(result).toEqual(mockData);
  });
});

describe('financeApi.createFeeStructure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts to the preferred fee structures endpoint with normalized payload', async () => {
    const feeData = {
      name: 'Lunch Program',
      amount: '1500',
      academic_year: '2026',
      term: 'Term 1',
      target_cohort: 'All Students',
    };
    const responseData = { id: 10, ...feeData, amount: 1500 };

    apiClient.post.mockResolvedValue({ data: responseData });

    const result = await financeApi.createFeeStructure(feeData);

    expect(apiClient.post).toHaveBeenCalledWith('/api/fees/structures', {
      ...feeData,
      amount: 1500,
    });
    expect(result).toEqual(responseData);
  });

  it('falls back when preferred create endpoint returns 404', async () => {
    const feeData = {
      name: 'Exam Fee',
      amount: '1200',
      academic_year: '2026',
      term: 'Term 2',
      target_cohort: 'Form 4',
    };
    const responseData = { id: 11, ...feeData, amount: 1200 };

    apiClient.post
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ data: responseData });

    const result = await financeApi.createFeeStructure(feeData);

    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/api/fees/structures', {
      ...feeData,
      amount: 1200,
    });
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/api/finance/fees/structures', {
      ...feeData,
      amount: 1200,
    });
    expect(result).toEqual(responseData);
  });
});
