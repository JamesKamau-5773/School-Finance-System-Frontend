import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(window, 'print', {
    value: vi.fn(),
    writable: true,
  });
});
