import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseFeeStructures = vi.fn();
const mockIssueInvoices = vi.fn();

vi.mock('./hooks/useFees', () => ({
  useFeeStructures: (...args) => mockUseFeeStructures(...args),
  useIssueInvoices: () => ({
    mutate: mockIssueInvoices,
    isPending: false,
    variables: undefined,
  }),
}));

vi.mock('./CreateLevyModal', () => ({
  default: ({ isOpen }) => <div data-testid="create-levy-modal">{isOpen ? 'open' : 'closed'}</div>,
}));

import FeeMaster from './FeeMaster';

describe('FeeMaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders loading state while fee structures are loading', () => {
    mockUseFeeStructures.mockReturnValue({ data: null, isLoading: true });

    render(<FeeMaster />);

    expect(screen.getByText('Loading catalog...')).toBeInTheDocument();
  });

  it('renders fee rows and triggers invoicing mutation after confirmation', () => {
    mockUseFeeStructures.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          {
            id: 11,
            name: 'Exam Fee',
            target_cohort: 'Form 4',
            term: 'Term 1',
            amount: 2500,
          },
        ],
      },
    });

    render(<FeeMaster />);

    fireEvent.click(screen.getByRole('button', { name: /issue invoices/i }));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(mockIssueInvoices).toHaveBeenCalledTimes(1);
    expect(mockIssueInvoices).toHaveBeenCalledWith(11, expect.any(Object));
  });

  it('shows success message when invoice mutation succeeds', () => {
    mockUseFeeStructures.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          {
            id: 12,
            name: 'Lunch Program',
            target_cohort: 'All Students',
            term: 'Term 2',
            amount: 1800,
          },
        ],
      },
    });

    mockIssueInvoices.mockImplementation((_id, options) => {
      options.onSuccess({ data: { message: 'Invoices issued successfully.' } });
    });

    render(<FeeMaster />);

    fireEvent.click(screen.getByRole('button', { name: /issue invoices/i }));

    expect(screen.getByText('Invoices issued successfully.')).toBeInTheDocument();
  });

  it('opens create levy modal from header action', () => {
    mockUseFeeStructures.mockReturnValue({
      isLoading: false,
      data: { data: [] },
    });

    render(<FeeMaster />);

    fireEvent.click(screen.getByRole('button', { name: /define new levy/i }));

    expect(screen.getByTestId('create-levy-modal')).toHaveTextContent('open');
  });
});
