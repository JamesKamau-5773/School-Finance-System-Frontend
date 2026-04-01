# API Integration Guide

## API Client Architecture

### Axios Instance Configuration

File: `src/api/apiClient.js`

```javascript
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### JWT Token Interceptor

Automatically attaches JWT token to all requests:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor

Handles token expiration and common errors:

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints

### Authentication Endpoints

#### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "bursar@school.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "email": "bursar@school.edu",
    "name": "John Bursar",
    "role": "bursar"
  },
  "mustChangePassword": false,
  "message": "Login successful"
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password incorrect"
}
```

**Usage:**
```javascript
const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};
```

#### Change Password

**Endpoint:** `POST /api/auth/change-password`

**Request:**
```json
{
  "currentPassword": "tempPassword123!",
  "newPassword": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response:**
```json
{
  "error": "Validation error",
  "details": ["Current password incorrect", "New password too weak"]
}
```

### Finance Endpoints

#### Get Cashbook Transactions

**Endpoint:** `GET /api/finance/transactions`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD
- `type` (optional): 'income', 'expense', 'capitation'
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "trans-001",
      "type": "capitation",
      "description": "Capitation funding received",
      "amount": 50000.00,
      "balance": 250000.00,
      "date": "2024-01-15",
      "createdBy": "admin@school.edu"
    }
  ],
  "total": 50000.00,
  "count": 1
}
```

**Usage:**
```javascript
const getTransactions = async (filters) => {
  const response = await apiClient.get('/api/finance/transactions', {
    params: filters,
  });
  return response.data;
};
```

#### Record Income Transaction

**Endpoint:** `POST /api/finance/transactions`

**Request:**
```json
{
  "type": "capitation",
  "description": "School capitation funding",
  "amount": 50000.00,
  "date": "2024-01-15",
  "voteHead": "CAPITATION"
}
```

**Response:**
```json
{
  "id": "trans-001",
  "type": "capitation",
  "amount": 50000.00,
  "balance": 250000.00,
  "message": "Transaction recorded successfully"
}
```

#### Get Fees Configuration

**Endpoint:** `GET /api/fees`

**Response:**
```json
{
  "data": [
    {
      "id": "fee-001",
      "name": "Tuition Fee (Day)",
      "amount": 50000.00,
      "category": "tuition",
      "applicableGrades": ["Form 1", "Form 2", "Form 3", "Form 4"],
      "isActive": true
    }
  ]
}
```

#### Create Fee Levy

**Endpoint:** `POST /api/fees`

**Request:**
```json
{
  "name": "Science Practical Fee",
  "amount": 5000.00,
  "category": "optional",
  "applicableGrades": ["Form 3", "Form 4"],
  "description": "For laboratory materials"
}
```

**Response:**
```json
{
  "id": "fee-002",
  "name": "Science Practical Fee",
  "message": "Fee created successfully"
}
```

### Student Endpoints

#### Get Student Directory

**Endpoint:** `GET /api/students`

**Query Parameters:**
- `search` (optional): Name, admission number, or email
- `class` (optional): Form 1, Form 2, etc.
- `status` (optional): active, inactive
- `page` (optional): Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "std-001",
      "name": "Jane Doe",
      "admissionNo": "ADM001",
      "email": "jane@school.edu",
      "class": "Form 2",
      "status": "active",
      "balance": 25000.00
    }
  ],
  "total": 1,
  "page": 1
}
```

#### Record Student Payment

**Endpoint:** `POST /api/students/:id/payments`

**Request:**
```json
{
  "amount": 25000.00,
  "paymentMethod": "bank_transfer",
  "reference": "TRF-12345",
  "date": "2024-01-20"
}
```

**Response:**
```json
{
  "message": "Payment recorded successfully",
  "newBalance": 0.00,
  "receipt": "RCPT-001"
}
```

### Inventory Endpoints

#### Get Inventory Status

**Endpoint:** `GET /api/inventory/status`

**Response:**
```json
{
  "data": [
    {
      "itemId": "inv-001",
      "name": "Desk",
      "currentStock": 45,
      "minimumStock": 10,
      "category": "furniture",
      "unit": "pieces"
    }
  ],
  "lastUpdated": "2024-01-20T10:30:00Z"
}
```

**Authorization:** Requires admin, principal, clerk, or storekeeper role

#### Record Stock Transaction

**Endpoint:** `POST /api/inventory/transactions`

**Request:**
```json
{
  "itemId": "inv-001",
  "action": "received",
  "quantity": 50,
  "reference": "PO-2024-001",
  "date": "2024-01-20",
  "notes": "Received from supplier"
}
```

**Response:**
```json
{
  "transactionId": "itxn-001",
  "newStock": 95,
  "message": "Stock transaction recorded"
}
```

### Reports Endpoints

#### Get Trial Balance Report

**Endpoint:** `GET /api/reports/trial-balance`

**Query Parameters:**
- `asAtDate` (optional): YYYY-MM-DD (defaults to today)

**Response:**
```json
{
  "asAtDate": "2024-01-20",
  "accounts": [
    {
      "voteHead": "CAPITATION",
      "debit": 500000.00,
      "credit": 0.00,
      "balance": 500000.00
    },
    {
      "voteHead": "EXPENSES",
      "debit": 0.00,
      "credit": 150000.00,
      "balance": -150000.00
    }
  ],
  "totalDebits": 500000.00,
  "totalCredits": 150000.00,
  "totalBalance": 350000.00
}
```

### User Management Endpoints

#### Get All Users

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `search` (optional): Name or email
- `role` (optional): Filter by role

**Response:**
```json
{
  "data": [
    {
      "id": "user-001",
      "email": "john@school.edu",
      "name": "John Doe",
      "role": "bursar",
      "status": "active"
    }
  ]
}
```

**Authorization:** Admin only

#### Create User

**Endpoint:** `POST /api/users`

**Request:**
```json
{
  "email": "newuser@school.edu",
  "name": "New User",
  "role": "storekeeper",
  "temporary_password": "TempPass123!"
}
```

**Response:**
```json
{
  "id": "user-002",
  "email": "newuser@school.edu",
  "message": "User created successfully. Temporary password: TempPass123!"
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "statusCode": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Use response data |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Fix request parameters |
| 401 | Unauthorized | Re-authenticate (login) |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Validation Error | Fix validation errors |
| 500 | Server Error | Report to backend team |

### Handling Errors in Components

```javascript
const { data, error, loading } = useQuery('transactions', getTransactions);

if (loading) return <Loading />;

if (error) {
  if (error.response?.status === 403) {
    return <PermissionDenied />;
  }
  if (error.response?.status === 401) {
    return <SessionExpired />;
  }
  return <ErrorBoundary error={error} />;
}

return <TransactionList data={data} />;
```

## Rate Limiting

The API implements rate limiting per user:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1703079600
```

### Handling Rate Limits

```javascript
if (error.response?.status === 429) {
  const resetTime = parseInt(error.response.headers['x-ratelimit-reset']);
  const waitSeconds = resetTime - Math.floor(Date.now() / 1000);
  console.warn(`Rate limited. Retry after ${waitSeconds} seconds`);
  
  // Implement exponential backoff
  setTimeout(() => retry(), waitSeconds * 1000);
}
```

## Authentication Flow

### Initial Login

```
1. User enters credentials
   |
   v
2. Client POST /api/auth/login
   |
   v
3. Backend validates
   |
   v
4. Backend returns JWT token
   |
   v
5. Client stores token in localStorage
   |
   v
6. Interceptor attaches token to future requests
```

### Token Refresh

```
1. Request returns 401 (Unauthorized)
   |
   v
2. Interceptor catches 401
   |
   v
3. No automatic refresh in current implementation
   |
   v
4. Redirect to login required
   |
   v
5. User logs in again
```

Future: Implement refresh token endpoint for transparent refresh.

## API Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bursar@school.edu",
    "password": "password123"
  }'

# Get transactions (with token)
curl -X GET http://localhost:5000/api/finance/transactions \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1Q..."
```

### Using HTTP Client in VS Code

File: `requests.http`

```
@baseUrl = http://localhost:5000

### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "bursar@school.edu",
  "password": "password123"
}

### Get Transactions
GET {{baseUrl}}/api/finance/transactions
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Testing in React

### Using React Query for Testing

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

render(
  <QueryClientProvider client={queryClient}>
    <YourComponent />
  </QueryClientProvider>
);
```

### Mocking API Responses

```javascript
jest.mock('../api/financeApi', () => ({
  getTransactions: jest.fn(() => 
    Promise.resolve([
      { id: 1, type: 'income', amount: 1000 },
    ])
  ),
}));
```

## API Documentation (Backend)

For complete backend API documentation, see:

- Backend repository: `/docs/API.md`
- OpenAPI/Swagger: `http://localhost:5000/swagger`
- Backend source: `/app/controllers/`

## Debugging API Issues

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make request in app
4. Click request in list
5. View Request/Response headers and body

### Common Issues

**Issue:** 401 Unauthorized on all requests

**Solution:**
- Verify JWT token in localStorage
- Check token hasn't expired
- Verify Authorization header format

**Issue:** 403 Forbidden

**Solution:**
- Check user role has permission (see RBAC.md)
- Verify backend includes role in decorator
- Check request headers include Authorization

**Issue:** CORS errors

**Solution:**
- Verify backend CORS configuration
- Check frontend uses correct API URL
- Ensure preflight requests succeed

## API Performance

### Response Times (Production)

| Endpoint | Target | Status |
|----------|--------|--------|
| GET /api/transactions | < 200ms | On target |
| POST /api/students/:id/payments | < 300ms | On target |
| GET /api/reports/trial-balance | < 500ms | On target |

### Optimization

- Results paginated by default (limit: 100)
- Use filters to reduce result sets
- Cache responses with React Query
- Implement request debouncing for search

## Future API Enhancements

- GraphQL endpoint for flexible queries
- WebSocket for real-time updates
- Refresh token mechanism for better UX
- Advanced filtering and sorting
- Batch operations for bulk updates
