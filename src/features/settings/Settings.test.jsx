import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseVoteHeads = vi.fn();
const mockCreateVoteHead = vi.fn();
const mockUpdateVoteHead = vi.fn();
const mockDeleteVoteHead = vi.fn();

vi.mock('../cashbook/hooks/useCashbook', () => ({
  useVoteHeads: () => mockUseVoteHeads(),
  useCreateVoteHead: () => ({
    mutateAsync: mockCreateVoteHead,
    isPending: false,
  }),
  useUpdateVoteHead: () => ({
    mutateAsync: mockUpdateVoteHead,
    isPending: false,
  }),
  useDeleteVoteHead: () => ({
    mutateAsync: mockDeleteVoteHead,
    isPending: false,
  }),
}));

import Settings from './Settings';

describe('Settings vote-head management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockCreateVoteHead.mockResolvedValue({});
    mockUpdateVoteHead.mockResolvedValue({});
    mockDeleteVoteHead.mockResolvedValue({});
  });

  it('submits create vote-head with generated code when code field is empty', async () => {
    mockUseVoteHeads.mockReturnValue({ data: { data: [] }, isLoading: false });

    render(<Settings />);

    fireEvent.click(screen.getByRole('button', { name: /vote heads/i }));

    fireEvent.change(screen.getByPlaceholderText('e.g. Lunch programme'), {
      target: { value: 'Lunch programme' },
    });
    fireEvent.change(screen.getByPlaceholderText('0'), {
      target: { value: '22' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(mockCreateVoteHead).toHaveBeenCalledWith({
        name: 'Lunch programme',
        vote_head: 'Lunch programme',
        code: 'LP',
        percentage: 22,
        allocation_percentage: 22,
      });
    });
  });

  it('applies MoE standards and preserves existing vote-head code on update', async () => {
    mockUseVoteHeads.mockReturnValue({
      data: {
        data: [
          {
            id: 5,
            name: 'Lunch programme',
            percentage: 20,
            code: 'LUNCH01',
          },
        ],
      },
      isLoading: false,
    });

    render(<Settings />);

    fireEvent.click(screen.getByRole('button', { name: /vote heads/i }));
    fireEvent.click(screen.getByRole('button', { name: /apply moe standard %/i }));

    await waitFor(() => {
      expect(mockUpdateVoteHead).toHaveBeenCalledWith({
        id: 5,
        data: {
          name: 'Lunch programme',
          vote_head: 'Lunch programme',
          code: 'LUNCH01',
          percentage: 22,
          allocation_percentage: 22,
        },
      });
    });

    await waitFor(() => {
      expect(mockCreateVoteHead).toHaveBeenCalled();
    });
  });

  it('loads and saves academic term from persistent system settings storage', async () => {
    vi.useFakeTimers();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    localStorage.setItem(
      'sfs_system_settings',
      JSON.stringify({
        academicYear: '2027',
        currentTerm: 'Term 2',
      }),
    );

    mockUseVoteHeads.mockReturnValue({ data: { data: [] }, isLoading: false });

    render(<Settings />);

    fireEvent.click(screen.getByRole('button', { name: /academic cycle/i }));

    const [academicYearSelect, currentTermSelect] = screen.getAllByRole('combobox');
    expect(academicYearSelect).toHaveValue('2027');
    expect(currentTermSelect).toHaveValue('Term 2');

    fireEvent.change(currentTermSelect, { target: { value: 'Term 3' } });
    fireEvent.click(screen.getByRole('button', { name: /save configurations/i }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      'sfs_system_settings',
      expect.stringContaining('"currentTerm":"Term 3"'),
    );

    setItemSpy.mockRestore();
    vi.useRealTimers();
  });
});
