# Testing Guide

## Testing Strategy

The School Financial System uses a multi-layered testing approach:

1. **Unit Tests** - Individual functions and utilities
2. **Component Tests** - React component rendering and behavior
3. **Integration Tests** - Feature workflows across modules
4. **E2E Tests** - Complete user journeys (future)

## Running Tests

### Unit and Component Tests

```bash
npm test
```

Runs all test files matching `*.test.js` or `*.test.jsx`

### Watch Mode

```bash
npm test -- --watch
```

Automatically reruns tests when files change.

### Coverage Report

```bash
npm test -- --coverage
```

Shows test coverage percentage.

## Test Files Structure

```
src/
  api/
    financeApi.test.js
  auth/
    roleAccess.test.js
  features/
    fees/
      FeeMaster.test.jsx
```

## Unit Tests

### Testing Utilities

Example: `src/utils/passwordValidation.js`

```javascript
describe('validatePassword', () => {
  it('should validate strong password', () => {
    const result = validatePassword('SecurePass123!');
    expect(result.isValid()).toBe(true);
  });
  
  it('should reject weak password', () => {
    const result = validatePassword('weak');
    expect(result.isValid()).toBe(false);
  });
  
  describe('password requirements', () => {
    it('should require uppercase', () => {
      const result = validatePassword('securepass123!');
      expect(result.hasUpperCase).toBe(false);
    });
    
    it('should require lowercase', () => {
      const result = validatePassword('SECUREPASS123!');
      expect(result.hasLowerCase).toBe(false);
    });
    
    it('should require numbers', () => {
      const result = validatePassword('SecurePass!');
      expect(result.hasNumbers).toBe(false);
    });
    
    it('should require special characters', () => {
      const result = validatePassword('SecurePass123');
      expect(result.hasSpecialChar).toBe(false);
    });
    
    it('should require minimum length', () => {
      const result = validatePassword('Pass1!');
      expect(result.isLongEnough).toBe(false);
    });
  });
});
```

### Testing RBAC

File: `src/auth/roleAccess.test.js`

```javascript
import { canAccessModule, normalizeRole } from './roleAccess';

describe('Role Access Control', () => {
  describe('Bursar Role', () => {
    it('should have cashbook access', () => {
      expect(canAccessModule('bursar', 'cashbook')).toBe(true);
    });
    
    it('should have fees access', () => {
      expect(canAccessModule('bursar', 'fees')).toBe(true);
    });
    
    it('should NOT have user management access', () => {
      expect(canAccessModule('bursar', 'users')).toBe(false);
    });
  });
  
  describe('Admin Role', () => {
    it('should have access to all modules', () => {
      const modules = ['cashbook', 'fees', 'students', 'inventory', 'users'];
      modules.forEach(module => {
        expect(canAccessModule('admin', module)).toBe(true);
      });
    });
  });
  
  describe('Role Normalization', () => {
    it('should normalize busar to bursar', () => {
      expect(normalizeRole('busar')).toBe('bursar');
    });
    
    it('should handle case insensitivity', () => {
      expect(normalizeRole('ADMIN')).toBe('admin');
    });
  });
});
```

## Component Tests

### Testing React Components

Example: Testing a form component

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
  
  it('should submit with credentials', async () => {
    const mockLogin = jest.fn();
    render(<LoginPage onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@school.edu' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@school.edu',
      password: 'Password123!'
    });
  });
  
  it('should show error on invalid credentials', async () => {
    const mockLogin = jest.fn().mockRejectedValue(
      new Error('Invalid credentials')
    );
    render(<LoginPage onLogin={mockLogin} />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await screen.findByText(/invalid credentials/i);
  });
});
```

### Testing PasswordInput Component

```javascript
import PasswordInput from './PasswordInput';

describe('PasswordInput', () => {
  it('should toggle password visibility', () => {
    const { getByDisplayValue, getByRole } = render(
      <PasswordInput value="password123" onChange={jest.fn()} />
    );
    
    const input = getByDisplayValue('•••••••••••');
    expect(input).toHaveAttribute('type', 'password');
    
    fireEvent.click(getByRole('button'));
    expect(input).toHaveAttribute('type', 'text');
  });
});
```

## Integration Tests

### Testing Feature Workflows

Example: Testing cashbook transaction recording

```javascript
describe('Cashbook Transaction Workflow', () => {
  let mockApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(() => Promise.resolve({ data: [] })),
      post: jest.fn(() => Promise.resolve({ data: { id: 'trans-1' } }))
    };
  });
  
  it('should record income transaction', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CashbookDashboard apiClient={mockApiClient} />
      </QueryClientProvider>
    );
    
    // Open modal
    fireEvent.click(screen.getByText(/record transaction/i));
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'income' }
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '50000' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify API call
    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/finance/transactions',
        expect.objectContaining({
          type: 'income',
          amount: 50000
        })
      );
    });
  });
});
```

## Mocking

### Mocking API Calls

```javascript
// Mock API module
jest.mock('../api/financeApi', () => ({
  getTransactions: jest.fn(() =>
    Promise.resolve([
      {
        id: 'trans-1',
        type: 'income',
        amount: 50000,
        description: 'Capitation'
      }
    ])
  ),
  createTransaction: jest.fn(() =>
    Promise.resolve({ id: 'trans-2', type: 'income' })
  )
}));
```

### Mocking Context

```javascript
// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'bursar', email: 'bursar@school.edu' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  })
}));
```

## Test Utilities

### Custom Render Function

File: `src/test/setup.js`

```javascript
import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

export function renderWithProviders(component) {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
```

Usage:

```javascript
import { renderWithProviders } from '../test/setup';

test('component renders with providers', () => {
  renderWithProviders(<YourComponent />);
  // Component now has access to all contexts
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

Bad:
```javascript
it('should call setState', () => {
  // Don't test internal implementation
});
```

Good:
```javascript
it('should display updated balance after transaction', () => {
  // Test what user sees
});
```

### 2. Use Semantic Queries

```javascript
// Good - find by what users see
screen.getByRole('button', { name: /save/i });
screen.getByLabelText(/amount/i);

// Avoid - implementation details
screen.getByTestId('save-btn');
screen.getByClassName('input-field');
```

### 3. Test User Workflows

```javascript
// Instead of testing components in isolation:
describe('Student Payment Workflow', () => {
  it('should record payment and update balance', () => {
    // Complete user journey
  });
});
```

### 4. Keep Tests Focused

Each test should verify one behavior:

```javascript
it('should show error message and disable submit button', () => {
  // Two behaviors = two tests
});

// Split into:
it('should show error message on invalid email', () => {});
it('should disable submit button on validation error', () => {});
```

## Test Coverage Targets

| Category | Target |
|----------|--------|
| Utilities | 90%+ |
| Components | 80%+ |
| Features | 70%+ |
| Overall | 75%+ |

Check coverage:

```bash
npm test -- --coverage
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Debugging Tests

### Using console.log

```javascript
it('should process data', () => {
  const result = processData(input);
  console.log('Result:', result);  // Will print in test output
  expect(result).toBe(expected);
});
```

### Debugging Functions

```javascript
it('should debug step by step', () => {
  debugger;  // Execution will pause here
  const result = complexFunction();
  expect(result).toBe(expected);
});

// Run tests with: node --inspect-brk node_modules/.bin/jest --runInBand
```

### Using screen.debug()

```javascript
import { render, screen } from '@testing-library/react';

it('should render', () => {
  render(<Component />);
  screen.debug();  // Prints DOM to console
});
```

## Testing Authentication

```javascript
describe('Protected Routes', () => {
  it('should redirect unauthenticated user to login', () => {
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        loading: false
      })
    }));
    
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
  
  it('should show component when authenticated', () => {
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        loading: false,
        user: { role: 'admin' }
      })
    }));
    
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
```

## Performance Testing

### Measuring Component Render Time

```javascript
import { render } from '@testing-library/react';

it('should render quickly', () => {
  const start = performance.now();
  render(<HeavyComponent />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100);  // Must render in < 100ms
});
```

## End-to-End Tests (Future)

### Cypress Example

```javascript
describe('Bursar Cashbook Workflow', () => {
  it('should record transaction and view updated balance', () => {
    cy.visit('http://localhost:5173/login');
    
    cy.get('input[name=email]').type('bursar@school.edu');
    cy.get('input[name=password]').type('password123');
    cy.get('button:contains("Login")').click();
    
    cy.get('nav').contains('Cashbook').click();
    
    cy.get('button:contains("Record Transaction")').click();
    cy.get('select[name=type]').select('income');
    cy.get('input[name=amount]').type('50000');
    cy.get('button:contains("Save")').click();
    
    cy.get('h2').should('contain', '50000');
  });
});
```

Run: `npm run test:e2e`

## Test Maintenance

### Keep Tests Updated

When code changes, update tests:

```bash
# Run tests in watch mode
npm test -- --watch

# Update snapshots if needed
npm test -- -u
```

### Remove Obsolete Tests

Delete tests for removed features.

### Refactor Together

When refactoring code, refactor tests together.

## Reference

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io)
