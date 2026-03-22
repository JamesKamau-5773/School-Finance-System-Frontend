import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseStudentDirectory = vi.fn();
const mockDeleteStudent = vi.fn();

vi.mock('./hooks/useStudents', () => ({
  useStudentDirectory: (...args) => mockUseStudentDirectory(...args),
  useDeleteStudent: () => ({ mutate: mockDeleteStudent }),
}));

vi.mock('use-debounce', () => ({
  useDebounce: (value) => [value],
}));

vi.mock('./StudentProfileModal', () => ({
  default: ({ isOpen, student }) => (
    <div data-testid="student-profile-modal">
      {isOpen ? `open:${student?.full_name}` : 'closed'}
    </div>
  ),
}));

vi.mock('./StudentFormModal', () => ({
  default: ({ isOpen, initialData }) => (
    <div data-testid="student-form-modal">
      {isOpen ? `open:${initialData?.full_name || 'new'}` : 'closed'}
    </div>
  ),
}));

import StudentDirectory from './StudentDirectory';

describe('StudentDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    window.history.replaceState({}, '', '/students');
  });

  it('renders loading state while data is being fetched', () => {
    mockUseStudentDirectory.mockReturnValue({ data: null, isLoading: true });

    render(<StudentDirectory />);

    expect(screen.getByText('Loading directory...')).toBeInTheDocument();
  });

  it('renders empty state when no students are found', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: { data: [] },
    });

    render(<StudentDirectory />);

    expect(screen.getByText('No active students found.')).toBeInTheDocument();
  });

  it('opens profile modal when view ledger action is clicked', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          {
            id: 1,
            full_name: 'John Doe',
            admission_number: 'ADM001',
            grade_level: 'Form 4',
            balance: 5000,
            sponsor: {
              name: 'Jane Doe',
              phone: '0712345678',
              relation: 'Mother',
            },
          },
        ],
      },
    });

    render(<StudentDirectory />);

    fireEvent.click(screen.getByTitle('View Ledger & Receive Payment'));

    expect(screen.getByTestId('student-profile-modal')).toHaveTextContent('open:John Doe');
  });

  it('opens form modal in create mode when register button is clicked', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: { data: [] },
    });

    render(<StudentDirectory />);

    fireEvent.click(screen.getByRole('button', { name: /register student/i }));

    expect(screen.getByTestId('student-form-modal')).toHaveTextContent('open:new');
  });

  it('calls delete mutation when deactivating a student and confirming', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          {
            id: 7,
            full_name: 'Mary Smith',
            admission_number: 'ADM007',
            grade_level: 'Form 3',
            balance: 0,
            sponsor: {
              name: 'John Smith',
              phone: '0798765432',
              relation: 'Father',
            },
          },
        ],
      },
    });

    render(<StudentDirectory />);

    fireEvent.click(screen.getByTitle('Deactivate Student'));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(mockDeleteStudent).toHaveBeenCalledWith(7);
  });

  it('toggles filter label from show all to defaulters', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: { data: [] },
    });

    render(<StudentDirectory />);

    const filterButton = screen.getByRole('button', { name: /show all/i });
    fireEvent.click(filterButton);

    expect(screen.getByRole('button', { name: /defaulters/i })).toBeInTheDocument();
  });

  it('applies grade filter and then defaulters filter together', () => {
    mockUseStudentDirectory.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          {
            id: 1,
            full_name: 'Form Three Defaulter',
            admission_number: 'ADM001',
            grade_level: 'Form 3',
            balance: 3200,
            sponsor: {
              name: 'Sponsor A',
              phone: '0711000000',
              relation: 'Parent',
            },
          },
          {
            id: 2,
            full_name: 'Form Three Cleared',
            admission_number: 'ADM002',
            grade_level: 'Form 3',
            balance: 0,
            sponsor: {
              name: 'Sponsor B',
              phone: '0711000001',
              relation: 'Parent',
            },
          },
          {
            id: 3,
            full_name: 'Form Two Defaulter',
            admission_number: 'ADM003',
            grade_level: 'Form 2',
            balance: 2800,
            sponsor: {
              name: 'Sponsor C',
              phone: '0711000002',
              relation: 'Guardian',
            },
          },
        ],
      },
    });

    render(<StudentDirectory />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Form 3' },
    });

    expect(screen.getByText('Form Three Defaulter')).toBeInTheDocument();
    expect(screen.getByText('Form Three Cleared')).toBeInTheDocument();
    expect(screen.queryByText('Form Two Defaulter')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show all/i }));

    expect(screen.getByText('Form Three Defaulter')).toBeInTheDocument();
    expect(screen.queryByText('Form Three Cleared')).not.toBeInTheDocument();
    expect(screen.queryByText('Form Two Defaulter')).not.toBeInTheDocument();
  });
});
