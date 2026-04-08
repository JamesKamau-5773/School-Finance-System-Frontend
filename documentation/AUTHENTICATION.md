# Authentication and Security

## Overview

The School Financial System uses JWT (JSON Web Token) based authentication with a secure session management system. This document covers authentication flows, password management, and security best practices.

## JWT Authentication

### Token Structure

JWT tokens have three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  [Header]
.eyJ1c2VyX2lkIjoiMTIzIiwicm9sZSI6ImJ1cnNhciJ9  [Payload]
.SflKxw...  [Signature]
```

### Token Storage

Tokens are stored in browser localStorage:

```javascript
localStorage.setItem('jwt_token', token);
```

File: `.env`

```bash
VITE_JWT_STORAGE_KEY=school_finance_jwt
VITE_JWT_HEADER_NAME=Authorization
```

### Token Lifecycle

1. User logs in with credentials
2. Backend validates and returns JWT
3. Frontend stores token locally
4. Token included in Authorization header for all API requests
5. Backend validates token signature on each request
6. Expired token results in 401, user redirected to login

### Token Expiration

Tokens expire after a set duration (backend configuration):

```python
# Backend
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
```

When expired, user must login again to get new token.

## Login Flow

### Standard Login

User logs in with email and password:

**LoginPage.jsx:**

```javascript
const handleLogin = async (credentials) => {
  try {
    const result = await login(credentials.email, credentials.password);
    
    if (result.mustChangePassword) {
      // Route to password change
      navigate('/profile', {
        state: {
          forcePasswordChange: true,
          notice: 'Temporary password detected. Update your password.'
        }
      });
    } else {
      // Route to dashboard
      navigate('/cashbook');
    }
  } catch (error) {
    setErrorMessage('Invalid email or password');
  }
};
```

### Temporary Password Workflow

**Scenario:** Admin creates new user with temporary password

**Workflow:**

```
1. Admin creates user account with temporary password
   |
   v
2. User receives credentials email
   |
   v
3. User logs in with temporary credentials
   |
   v
4. Backend returns { mustChangePassword: true }
   |
   v
5. Frontend redirects to ProfileSettings component
   |
   v
6. User forced to change password
   |
   v
7. New password saved, mustChangePassword flag removed
   |
   v
8. User redirected to dashboard
```

**ProfileSettings.jsx:**

```javascript
function ProfileSettings() {
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  
  useEffect(() => {
    if (location.state?.forcePasswordChange) {
      setForcePasswordChange(true);
    }
  }, [location.state]);
  
  if (forcePasswordChange) {
    return (
      <Alert type="warning">
        Your account requires a password change before continuing.
      </Alert>
    );
  }
  
  return <PasswordChangeForm />;
}
```

## Password Management

### Password Validation Rules

File: `src/utils/passwordValidation.js`

```javascript
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUpperCase: true,
  requireLowerCase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export const validatePassword = (password) => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    isLongEnough: password.length >= 8,
    isValid: () => {
      return Object.values(this)
        .slice(0, 4)
        .every(v => v) && this.isLongEnough;
    }
  };
};
```

### Valid Password Examples

```
Valid:     SecurePass123!
Valid:     MyPass@2024
Invalid:   password123       (no uppercase, no special)
Invalid:   Pass123           (no special chars)
Invalid:   Pass!              (no numbers)
Invalid:   passw0rd1!        (no uppercase)
```

### Password Change

**Endpoint:** `POST /api/auth/change-password`

**Request:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

**Error Cases:**

```json
{
  "error": "Validation error",
  "details": [
    "Current password is incorrect",
    "New password does not meet requirements"
  ]
}
```

### Password Visibility Toggle

Component: `src/components/PasswordInput.jsx`

```javascript
export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  error
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pr-10 py-2 border rounded"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
```

## Session Management

### Current User Context

File: `src/context/AuthContext.jsx`

```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has valid token on app load
    const token = localStorage.getItem('jwt_token');
    if (token) {
      validateToken(token)
        .then(user => {
          setUser(user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email, password) => {
    const result = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    
    localStorage.setItem('jwt_token', result.data.token);
    setUser(result.data.user);
    setIsAuthenticated(true);
    
    return result.data;
  };
  
  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Routes

File: `src/features/auth/ProtectedRoute.jsx`

```javascript
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

### Logout

```javascript
const handleLogout = () => {
  logout();  // Clear auth context
  navigate('/login');  // Redirect to login
};
```

## Security Best Practices

### 1. Token Security

Do:
- Store JWT in localStorage (accessible to JavaScript)
- Include token in Authorization header
- Validate token expiry

Don't:
- Log tokens to console in production
- Send tokens in query parameters
- Hardcode tokens in source code

### 2. Password Security

Do:
- Enforce strong password requirements
- Hash passwords on backend (bcrypt)
- Allow users to change passwords
- Force password change for temporary passwords

Don't:
- Store passwords in localStorage
- Send passwords over unencrypted connections
- Display password in plain text without user permission

### 3. HTTPS in Production

Ensure production deployment uses HTTPS:

```
Frontend: https://app.school.edu
Backend API: https://api.school.edu
```

Configure API client:

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.school.edu',  // HTTPS only
});
```

### 4. CORS Configuration

Backend must be configured to accept requests from frontend domain:

```python
CORS_ORIGINS = ['https://app.school.edu']
```

### 5. Input Validation

Validate all user inputs before sending to backend:

```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateNotEmpty = (value) => {
  return value && value.trim().length > 0;
};
```

### 6. Error Messages

Avoid disclosing system details in error messages:

Good:
```
"Invalid email or password"
```

Bad:
```
"User john@school.edu not found in database"
"Expected password hash mismatch with dbHash_random_123"
```

### 7. Session Timeout

Consider implementing idle session timeout:

```javascript
let inactivityTimeout;

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  
  inactivityTimeout = setTimeout(() => {
    logout();
    navigate('/login', { state: { reason: 'Session expired' } });
  }, 30 * 60 * 1000);  // 30 minutes
};

// Reset on user activity
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
```

### 8. Content Security Policy

Set CSP headers to prevent XSS attacks:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
```

## Two-Factor Authentication (Future)

Future enhancement: Add 2FA for increased security

```javascript
// Future: 2FA flow
const login = async (email, password) => {
  const result = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  
  if (result.requires2FA) {
    navigate('/verify-2fa', {
      state: { sessionToken: result.sessionToken }
    });
  } else {
    setToken(result.token);
    setUser(result.user);
  }
};
```

## Debugging Authentication Issues

### Issue: Token not in localStorage

```javascript
// Check if token exists
const token = localStorage.getItem('school_finance_jwt');
console.log('Token:', token);
```

### Issue: Requests not including Authorization header

```javascript
// Check interceptor is attaching header
apiClient.interceptors.request.use((config) => {
  console.log('Request headers:', config.headers);
  return config;
});
```

### Issue: Always redirected to login

```javascript
// Check if user is properly authenticated
const { user, isAuthenticated } = useAuth();
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
```

## Security Audit Checklist

- [ ] All passwords stored as bcrypt hashes
- [ ] HTTPS enforced in production
- [ ] CORS configured for specific origins
- [ ] JWT has expiration time
- [ ] Passwords enforced to be strong
- [ ] Logout clears all sensitive data
- [ ] No sensitive data in localStorage (except JWT)
- [ ] API validates authorization on every request
- [ ] Rate limiting enabled on login endpoint
- [ ] Session timeout implemented
- [ ] Security headers configured
- [ ] No debug info in production errors
- [ ] Dependencies scanned for vulnerabilities
- [ ] All inputs validated before API calls

## Compliance Notes

### GDPR Compliance

- Users can request password reset
- User data can be exported
- Account deletion clears all data

### Local Education Standards

Ensure compliance with local education ministry requirements regarding data storage and access.

## Support

For security concerns or vulnerabilities:

1. Do not publicly disclose security issues
2. Report to: security@school.edu
3. Allow time for remediation before disclosure
4. See TROUBLESHOOTING.md for common issues
