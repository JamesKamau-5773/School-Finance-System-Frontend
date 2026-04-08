# Architecture and Design

## System Architecture Overview

The School Financial System follows a modern layered architecture with clear separation of concerns:

```
User Interface Layer
  |
  v
Component Layer (React Components)
  |
  v
State Management Layer (Context API, React Query)
  |
  v
API/Communication Layer (Axios, HTTP)
  |
  v
Backend Services (Flask API)
  |
  v
Database (SQL)
```

## Directory Structure and Responsibilities

### `/src/api` - Data Access Layer

**Purpose:** Centralized HTTP client and API communication

**Key Files:**

- `apiClient.js` - Axios instance with JWT interceptor
- `financeApi.js` - Finance endpoints (cashbook, fees, transactions)
- `userApi.js` - User management endpoints

**Pattern:**

```javascript
// Each API module exports functions, not classes
export const getFinanceData = async () => {
  const response = await apiClient.get("/api/finance");
  return response.data;
};
```

**Features:**
- Automatic JWT token refresh
- Error handling with fallbacks
- Request/response transformation
- Centralized base URL configuration

### `/src/auth` - Authentication and Authorization

**Purpose:** Role-based access control and permission management

**Key Files:**

- `roleAccess.js` - RBAC matrix and permission helpers
- Used by components to guard access to features

**RBAC Matrix:**

```javascript
export const ROLE_PERMISSIONS = {
  cashbook: ['admin', 'bursar', 'principal'],
  fees: ['admin', 'bursar', 'principal'],
  inventory: ['admin', 'bursar', 'principal', 'storekeeper'],
  users: ['admin'],  // Only admin can manage users
};
```

**Usage:**

```javascript
const canAccess = canAccessModule(user.role, 'inventory');
if (canAccess) {
  // Show inventory feature
}
```

### `/src/context` - Global State Management

**Purpose:** React Context for global application state

**Key Files:**

- `AuthContext.jsx` - User authentication state, login/logout, JWT tokens

**Pattern:**

```javascript
const { user, login, logout, loading } = useAuth();
```

**Responsibilities:**
- JWT token storage and refresh
- User profile management
- Login/logout orchestration

### `/src/utils` - Caching and Utilities

**Purpose:** Client-side caching infrastructure and helper functions

**Key Files:**

- `indexedDBCache.js` - IndexedDB utilities for large datasets
- `passwordValidation.js` - Password strength validation
- `tokenHelper.js` - JWT token parsing and validation

**Caching Utilities:**

```javascript
// Save large dataset locally
import { saveToIndexedDB, STORES } from '@/utils/indexedDBCache'
await saveToIndexedDB(STORES.STUDENTS, studentData)

// Retrieve from IndexedDB (instant, zero latency)
const students = await getAllFromIndexedDB(STORES.STUDENTS)
```

**See [CACHING.md](./CACHING.md) for detailed caching architecture.**

- Password change workflows

### `/src/components` - Reusable UI Components

**Purpose:** Shared UI components used across features

**Key Components:**

- `AuthHelper.jsx` - Development JWT token helper display
- `MobileMenu.jsx` - Mobile hamburger navigation
- `PasswordInput.jsx` - Reusable password visibility toggle

**Pattern - Functional Components:**

```javascript
export default function PasswordInput({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <input type={showPassword ? "text" : "password"} />
      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}
```

### `/src/features` - Feature Modules

**Purpose:** Organized by business domain, not technical type

**Structure:**

```
features/
  auth/
    LoginPage.jsx          - Login form and workflow
    ProtectedRoute.jsx     - Route guard for authenticated routes
  
  cashbook/
    CashbookDashboard.jsx  - Main interface
    CashbookFilter.jsx     - Filter and search
    CapitationModal.jsx    - Create/edit capitation
    ExpenseModal.jsx       - Create/edit expense
    PaymentModal.jsx       - Create/edit payment
    ReallocateModal.jsx    - Reallocate funds
    hooks/
      useCashbook.js       - Data fetching logic
    components/
      DatePicker.jsx       - Reusable date picker
  
  fees/
    FeeMaster.jsx          - Fee configuration
    CreateLevyModal.jsx    - Create new levy
    hooks/
      useFees.js
      useStudents.js
  
  inventory/
    StorekeeperDashboard.jsx
    InventoryItemFormModal.jsx
    StockTransactionModal.jsx
    hooks/
      useInventory.js
  
  students/
    StudentDirectory.jsx
    StudentFormModal.jsx
    StudentProfileModal.jsx
    ReceivePaymentModal.jsx
    hooks/
      useStudents.js
  
  reports/
    TrialBalance.jsx       - Audit and financial reports
  
  profile/
    ProfileSettings.jsx    - User profile and password management
  
  settings/
    Settings.jsx           - Application settings
  
  users/
    UserManagement.jsx     - User CRUD operations
    UserFormModal.jsx      - Create/edit user
    hooks/
      useUsers.js
```

**Pattern - Feature Module:**

```javascript
// Container component (smart)
export default function FeatureDashboard() {
  const { data, loading, error } = useFeatureData();
  
  return (
    <FeatureView
      data={data}
      loading={loading}
      error={error}
      onAction={handleAction}
    />
  );
}

// Presentation component (dumb)
function FeatureView({ data, loading, error, onAction }) {
  return (
    <div>
      {loading && <Loading />}
      {error && <Error message={error} />}
      {data && <DataDisplay data={data} onAction={onAction} />}
    </div>
  );
}
```

### `/src/layout` - Layout Components

**Purpose:** Application shells and layout structure

**Key Files:**

- `MainLayout.jsx` - Primary application layout with sidebar and main content

**Features:**
- Desktop sidebar navigation
- Mobile hamburger menu
- Responsive breakpoints
- Role-based navigation guard

### `/src/utils` - Utility Functions

**Purpose:** Pure functions and helpers

**Key Utilities:**

- `passwordValidation.js` - Password strength validation
- `tokenHelper.js` - JWT token operations

**Pattern:**

```javascript
export const validatePassword = (password) => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    isLongEnough: password.length >= 8,
  };
};
```

### `/src/test` - Test Configuration

**Purpose:** Test setup and fixtures

**Key Files:**

- `setup.js` - Test environment configuration

## State Management Strategy

### Global State (React Context)

**Used for:**
- User authentication
- JWT tokens
- Current user profile
- Global loading states

```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### Server State (React Query)

**Used for:**
- Cashbook transactions
- Fee configurations
- Student records
- Inventory items
- Reports data

```javascript
const { data, loading, error } = useQuery('cashbook', getFinanceData);
```

### Local Component State

**Used for:**
- Form inputs
- Modal visibility
- Filter selections
- Temporary UI states

```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
```

## Data Flow

### Fetching Data

```
Component (e.g., FeeMaster.jsx)
  |
  v
Hook (e.g., useFees.js)
  |
  v
React Query (cache layer)
  |
  v
API Client (financeApi.js)
  |
  v
Axios interceptor (JWT attach)
  |
  v
Backend API (HTTP GET/POST)
```

### Example: Fetching Fees

```javascript
// 1. Hook fetches and caches
export function useFees() {
  return useQuery('fees', async () => {
    return await financeApi.getFees();
  });
}

// 2. Component uses hook
function FeeMaster() {
  const { data: fees } = useFees();
  return <FeeTable fees={fees} />;
}

// 3. API makes request with JWT
export const getFees = async () => {
  return apiClient.get('/api/fees');
  // JWT attached automatically by interceptor
};
```

## Component Patterns

### Smart (Container) Components

**Responsibility:** Logic and data fetching

```javascript
export default function FeeMasterContainer() {
  const { data, loading, error } = useFees();
  const [filters, setFilters] = useState({});
  
  return (
    <FeeMasterView
      fees={data}
      loading={loading}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
```

### Dumb (Presentational) Components

**Responsibility:** UI rendering only

```javascript
function FeeMasterView({ fees, loading, filters, onFilterChange }) {
  return (
    <>
      <FilterBar filters={filters} onChange={onFilterChange} />
      <FeeTable fees={fees} loading={loading} />
    </>
  );
}
```

### Modal Pattern

```javascript
function EntityModal({ isOpen, onClose, onSubmit }) {
  const { register, handleSubmit } = useForm();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
}
```

## Routing Architecture

### Route Structure

```javascript
// App.jsx
const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: 'cashbook', element: <CashbookDashboard /> },
      { path: 'fees', element: <FeeMaster /> },
      { path: 'students', element: <StudentDirectory /> },
      { path: 'inventory', element: <StorekeeperDashboard /> },
      { path: 'reports', element: <TrialBalance /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <ProfileSettings /> },
    ]
  }
];
```

### Route Guards

```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
}
```

## Styling Architecture

### TailwindCSS Configuration

**File:** `tailwind.config.js`

**Features:**
- Custom color palette for school branding
- Responsive breakpoints (mobile, tablet, desktop)
- Custom utilities for repeated patterns

**Color System:**

```javascript
colors: {
  'structural-navy': '#1e3a5f',
  'app-background': '#f5f7fa',
  'action-mint': '#10b981',
  'alert-crimson': '#dc2626',
}
```

### Responsive Design

**Breakpoints:**
- `sm`: 640px (small phones)
- `md`: 768px (tablets/desktop)
- `lg`: 1024px (large desktop)
- `xl`: 1280px (extra large desktop)

**Mobile-First Approach:**

```javascript
// Mobile by default, then override for larger screens
className="p-4 md:p-6 lg:p-8"
```

### Component Styling

**Pattern:**

```javascript
const buttonVariants = {
  primary: 'bg-action-mint text-white hover:bg-action-mint/90',
  secondary: 'bg-app-background text-structural-navy hover:bg-app-background/80',
  danger: 'bg-alert-crimson text-white hover:bg-alert-crimson/90',
};

export function Button({ variant = 'primary', className, ...props }) {
  return (
    <button className={`${buttonVariants[variant]} ${className}`} {...props} />
  );
}
```

## Error Handling

### API Errors

```javascript
getInventoryStatus: async () => {
  try {
    return await apiClient.get("/api/inventory/status");
  } catch (error) {
    if (error?.response?.status === 403) {
      // Permission denied - show restricted message
      return { data: [], restricted: true };
    }
    if (error?.response?.status === 404) {
      // Not found - return empty
      return { data: [] };
    }
    throw error;  // Propagate unknown errors
  }
}
```

### Component Error Boundaries

Can be implemented with React.errorBoundary or manual error states:

```javascript
function SafeComponent() {
  const [error, setError] = useState(null);
  
  if (error) {
    return <ErrorFallback error={error} />;
  }
  
  return <Component />;
}
```

## Performance Optimizations

### Memo and useMemo

```javascript
// Prevent unnecessary re-renders
const MemoizedList = React.memo(function List({ items }) {
  return items.map(item => <Item key={item.id} item={item} />);
});

// Prevent expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### Code Splitting

Future optimization using React.lazy():

```javascript
const InventoryDashboard = lazy(() => 
  import('./features/inventory/StorekeeperDashboard')
);

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <InventoryDashboard />
</Suspense>
```

## Testing Strategy

### Unit Tests

Test individual functions:

```javascript
describe('validatePassword', () => {
  it('should require uppercase letter', () => {
    const result = validatePassword('password123!');
    expect(result.hasUpperCase).toBe(false);
  });
});
```

### Component Tests

Test component behavior:

```javascript
describe('LoginPage', () => {
  it('should submit form with credentials', async () => {
    render(<LoginPage />);
    // Enter credentials
    // Submit form
    // Assert navigation
  });
});
```

### Integration Tests

Test feature workflows:

```javascript
describe('Student Payment Workflow', () => {
  it('should record payment and update balance', async () => {
    // Login as bursar
    // Navigate to student directory
    // Record payment
    // Verify balance updated
  });
});
```

## Security Considerations

### JWT Token Storage

- Stored in localStorage
- Attached to all API requests via interceptor
- Includes expiration check

### Password Workflows

- Users must change temporary password on first login
- Password validation enforces minimum requirements
- Supports password visibility toggle

### RBAC Implementation

- Frontend enforces UI restrictions
- Backend enforces authorization
- Role matrix centralized for consistency

### XSS Protection

- React auto-escapes JSX content
- No innerHTML usage
- DOMPurify optional for rich content

## Deployment Considerations

### Build Output

- Single-page application in `dist/` directory
- No server-side rendering required
- Can be served from any static host

### Environment Variables

Configured at build time via `.env` files:

```
VITE_API_URL=https://api.school.local
VITE_JWT_HEADER_NAME=Authorization
```

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support required
- Mobile responsive design

## Future Architecture Enhancements

1. **Route-based Code Splitting** - Lazy load feature modules
2. **State Management** - Consider Redux for complex state
3. **Component Library** - Storybook for component documentation
4. **E2E Testing** - Cypress or Playwright for full workflows
5. **Performance Monitoring** - Sentry or LogRocket for production
6. **Service Worker** - Offline support and caching strategy
