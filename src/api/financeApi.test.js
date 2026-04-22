import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
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

describe('financeApi.createVoteHead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts to vote-head endpoint with generated code from name', async () => {
    const responseData = { id: 1, name: 'Lunch programme', code: 'LP' };
    apiClient.post.mockResolvedValue({ data: responseData });

    const payload = {
      name: 'Lunch programme',
      vote_head: 'Lunch programme',
      percentage: 22,
    };

    const result = await financeApi.createVoteHead(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/api/finance/vote-heads', {
      ...payload,
      code: 'LP',
    });
    expect(result).toEqual(responseData);
  });

  it('uses explicit code when provided and normalizes to uppercase max length', async () => {
    const responseData = { id: 2, name: 'Insurance', code: 'INSURANCE001' };
    apiClient.post.mockResolvedValue({ data: responseData });

    const payload = {
      name: 'Insurance',
      code: 'insurance001extra',
      percentage: 4,
    };

    await financeApi.createVoteHead(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/api/finance/vote-heads', {
      ...payload,
      code: 'INSURANCE001',
    });
  });

  it('falls back to legacy underscore endpoint on 404', async () => {
    const payload = {
      name: 'Medical Fees',
      percentage: 5,
    };
    const responseData = { id: 3, name: 'Medical Fees', code: 'MF' };

    apiClient.post
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ data: responseData });

    const result = await financeApi.createVoteHead(payload);

    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/api/finance/vote-heads', {
      ...payload,
      code: 'MF',
    });
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/api/finance/vote_heads', {
      ...payload,
      code: 'MF',
    });
    expect(result).toEqual(responseData);
  });
});

describe('financeApi.updateVoteHead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('puts to vote-head endpoint with encoded id and generated code', async () => {
    const responseData = { id: 'abc/1', name: 'Activity fund', code: 'AF' };
    apiClient.put.mockResolvedValue({ data: responseData });

    const result = await financeApi.updateVoteHead({
      id: 'abc/1',
      data: { name: 'Activity fund', percentage: 8 },
    });

    expect(apiClient.put).toHaveBeenCalledWith('/api/finance/vote-heads/abc%2F1', {
      name: 'Activity fund',
      percentage: 8,
      code: 'AF',
    });
    expect(result).toEqual(responseData);
  });

  it('falls back to legacy underscore endpoint on 404', async () => {
    const responseData = { id: 10, name: 'Administrative Cost', code: 'AC' };

    apiClient.put
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ data: responseData });

    const payload = {
      id: 10,
      data: { name: 'Administrative Cost', percentage: 8 },
    };

    const result = await financeApi.updateVoteHead(payload);

    expect(apiClient.put).toHaveBeenNthCalledWith(1, '/api/finance/vote-heads/10', {
      name: 'Administrative Cost',
      percentage: 8,
      code: 'AC',
    });
    expect(apiClient.put).toHaveBeenNthCalledWith(2, '/api/finance/vote_heads/10', {
      name: 'Administrative Cost',
      percentage: 8,
      code: 'AC',
    });
    expect(result).toEqual(responseData);
  });
});
