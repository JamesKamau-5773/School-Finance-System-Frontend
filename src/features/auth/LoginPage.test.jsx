import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import LoginPage from './LoginPage';

describe('LoginPage password visibility toggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles password input type between hidden and visible', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const showButton = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(showButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
