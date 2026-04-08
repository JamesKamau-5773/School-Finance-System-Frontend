import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseTrialBalance = vi.fn();
const mockUseAccountLedger = vi.fn();

vi.mock('../cashbook/hooks/useCashbook', () => ({
  useTrialBalance: () => mockUseTrialBalance(),
  useAccountLedger: (...args) => mockUseAccountLedger(...args),
}));

import TrialBalance from './TrialBalance';

describe('TrialBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccountLedger.mockReturnValue({ data: [], isLoading: false });
  });

  it('renders loading state while data is being fetched', () => {
    mockUseTrialBalance.mockReturnValue({ data: null, isLoading: true });

    render(<TrialBalance />);

    expect(screen.getByText('Loading Audit Reports...')).toBeInTheDocument();
  });

  it('renders balanced report data and print action', () => {
    mockUseTrialBalance.mockReturnValue({
      isLoading: false,
      data: {
        lines: [
          { account: 'CASH_IN_BANK', debit: 1000, credit: 0 },
          { account: 'REVENUE', debit: 0, credit: 1000 },
        ],
        totals: {
          debit: 1000,
          credit: 1000,
          is_balanced: true,
        },
      },
    });

    render(<TrialBalance />);

    expect(screen.getByText('SYSTEM BALANCED: Total Debits exactly match Total Credits.')).toBeInTheDocument();
    expect(screen.getByText('CASH IN BANK')).toBeInTheDocument();
    expect(screen.getAllByText('1,000.00').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Print Report' }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('renders warning state when report is not balanced', () => {
    mockUseTrialBalance.mockReturnValue({
      isLoading: false,
      data: {
        lines: [{ account: 'EXPENSES', debit: 500, credit: 0 }],
        totals: {
          debit: 500,
          credit: 300,
          is_balanced: false,
        },
      },
    });

    render(<TrialBalance />);

    expect(screen.getByText('AUDIT WARNING: Ledger out of balance. Check transaction logs immediately.')).toBeInTheDocument();
  });

  it('renders api error state when trial balance query fails', () => {
    mockUseTrialBalance.mockReturnValue({
      isLoading: false,
      isError: true,
      error: {
        response: {
          status: 400,
          data: { error: 'Invalid report period' },
        },
      },
    });

    render(<TrialBalance />);

    expect(screen.getByText('Failed to load Audit Report (HTTP 400)')).toBeInTheDocument();
    expect(screen.getByText('Invalid report period')).toBeInTheDocument();
  });

  it('loads general ledger data for selected account', () => {
    mockUseTrialBalance.mockReturnValue({
      isLoading: false,
      data: {
        lines: [{ account: 'CASH_IN_BANK', debit: 1000, credit: 0 }],
        totals: {
          debit: 1000,
          credit: 1000,
          is_balanced: true,
        },
      },
    });
    mockUseAccountLedger.mockReturnValue({ data: [], isLoading: false });

    render(<TrialBalance />);
    fireEvent.click(screen.getByRole('button', { name: /General Ledger/i }));

    expect(mockUseAccountLedger).toHaveBeenCalled();
    expect(screen.getByText('No transactions found for this account.')).toBeInTheDocument();
  });
});
