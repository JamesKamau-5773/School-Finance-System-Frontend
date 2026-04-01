# Role-Based Access Control (RBAC)

## Overview

The School Financial System implements a comprehensive role-based access control (RBAC) system that defines which users can access which features. The RBAC matrix is centralized in `src/auth/roleAccess.js` and enforced at both frontend and backend levels.

## Role Definitions

### Admin

**Description:** Full system access

**Permissions:**
- Cashbook management (read, create, edit, delete)
- Fee master configuration (read, create, edit, delete)
- Student directory (read, create, edit, delete)
- Inventory management (read, create, edit, delete)
- Store ledger (read, create, edit, delete)
- Financial reports (read)
- User management (read, create, edit, delete)
- Settings (read, edit)
- Profile management

**Real-world Use:** School accountant or IT administrator

### Bursar

**Description:** Financial officer with broad permissions (no user management)

**Permissions:**
- Cashbook management (read, create, edit, delete)
- Fee master configuration (read, create, edit, delete)
- Student directory (read)
- Inventory management (read, create, edit, delete)
- Store ledger (read, create, edit, delete)
- Financial reports (read)
- Settings (read, edit)
- Profile management

**Restrictions:**
- Cannot access User Management
- Cannot delete financial transactions (audit trail)

**Real-world Use:** School bursar/treasurer

### Principal

**Description:** School leader with administrative authority (no user management)

**Permissions:**
- Cashbook management (read, create, edit, delete)
- Fee master configuration (read, create, edit, delete)
- Student directory (read)
- Inventory management (read)
- Store ledger (read)
- Financial reports (read)
- Settings (read, edit)
- Profile management

**Restrictions:**
- Cannot access User Management
- Can view but not create/edit/delete inventory items
- Can view but not create/edit/delete transactions

**Real-world Use:** School principal

### Storekeeper

**Description:** Inventory management specialist

**Permissions:**
- Inventory management (read, create, edit, delete)
- Store ledger (read, create, edit, delete)
- Student directory (read only)
- Profile management

**Restrictions:**
- Cannot access Cashbook
- Cannot access Fee Master
- Cannot access User Management
- Cannot access Settings

**Real-world Use:** Store manager/inventory clerk

### Clerk

**Description:** Support staff with data entry role

**Permissions:**
- Student directory (read, create, edit)
- Profile management

**Restrictions:**
- Read-only access to most financial features
- Cannot modify transactions
- Cannot enter inventory items

**Real-world Use:** Administrative assistant

## RBAC Matrix Implementation

### Module Access Matrix

File: `src/auth/roleAccess.js`

```javascript
export const ROLE_PERMISSIONS = {
  cashbook: ['admin', 'bursar', 'principal'],
  fees: ['admin', 'bursar', 'principal'],
  students: ['admin', 'bursar', 'principal', 'clerk'],
  inventory: ['admin', 'bursar', 'principal', 'storekeeper'],
  reports: ['admin', 'bursar', 'principal'],
  users: ['admin'],                          // Only admin
  settings: ['admin', 'bursar', 'principal'],
  ledger: ['admin', 'bursar', 'principal', 'storekeeper'],
};
```

### Usage in Components

#### Check Single Permission

```javascript
import { canAccessModule } from '../auth/roleAccess';

function FeeMaster() {
  const { user } = useAuth();
  
  if (!canAccessModule(user.role, 'fees')) {
    return <AccessDenied />;
  }
  
  return <FeeMasterContent />;
}
```

#### Check Multiple Permissions

```javascript
function Dashboard() {
  const { user } = useAuth();
  const hasFinancialAccess = canAccessModule(user.role, 'cashbook') ||
                             canAccessModule(user.role, 'fees');
  
  return hasFinancialAccess ? <FinancialDashboard /> : <LimitedView />;
}
```

#### Conditional Navigation

```javascript
function MainLayout() {
  const { user } = useAuth();
  const canAccess = (moduleKey) => canAccessModule(user?.role, moduleKey);
  
  return (
    <nav>
      {canAccess("cashbook") && (
        <NavLink to="/cashbook">Cashbook</NavLink>
      )}
      {canAccess("users") && (
        <NavLink to="/users">User Management</NavLink>
      )}
    </nav>
  );
}
```

## Frontend RBAC Flow

```
User logs in
  |
  v
Backend validates credentials
  |
  v
Backend returns { token, user: { role: 'bursar' } }
  |
  v
Frontend stores in AuthContext
  |
  v
Component checks: canAccessModule(role, 'module')
  |
  v
If allowed: render feature
If denied: render AccessDenied component
```

## Backend RBAC Enforcement

The frontend RBAC is for UI presentation only. The backend independently enforces permissions using decorators:

### Example: Inventory Controller

```python
from app.decorators import roles_required

@app.route('/api/inventory/status')
@jwt_required()
@roles_required('admin', 'principal', 'clerk', 'storekeeper')
def get_inventory_status():
    return get_inventory_data()

@app.route('/api/inventory/items', methods=['POST'])
@jwt_required()
@roles_required('admin', 'principal', 'bursar', 'storekeeper')
def create_inventory_item():
    return save_inventory_item()
```

### Known RBAC Gaps (Backend Restrictions)

The following endpoints currently exclude bursar role:

- `GET /api/inventory/status` - Restricted to: admin, principal, clerk, storekeeper

To grant bursar full inventory access, add 'bursar' to role lists in `app/controllers/inventory_controller.py`

## Role Normalization

The system handles common role typos:

```javascript
export const normalizeRole = (role) => {
  const normalizations = {
    'busar': 'bursar',      // Common typo
    'ADMIN': 'admin',       // Case handling
    'Admin': 'admin',
  };
  return normalizations[role] || role;
};
```

Usage:
```javascript
const normalizedRole = normalizeRole(userRole);
const hasAccess = canAccessModule(normalizedRole, 'cashbook');
```

## Dynamic Actions Based on Role

### Admin-Only Actions

```javascript
function TransactionTable({ transactions }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <table>
      {transactions.map(trans => (
        <tr>
          {/* ... transaction data ... */}
          {isAdmin && (
            <>
              <td><EditButton /></td>
              <td><DeleteButton /></td>
            </>
          )}
        </tr>
      ))}
    </table>
  );
}
```

### Role-Specific Visibility

```javascript
function UserManagementMenu() {
  const { user } = useAuth();
  
  return (
    <menu>
      {user?.role === 'admin' && (
        <>
          <MenuItem>Create User</MenuItem>
          <MenuItem>Assign Roles</MenuItem>
          <MenuItem>Deactivate User</MenuItem>
        </>
      )}
      {user?.role === 'principal' && (
        <MenuItem>View User Report</MenuItem>
      )}
    </menu>
  );
}
```

## Creating New Roles

To add a new role:

1. **Add to role matrix** (`src/auth/roleAccess.js`):

```javascript
export const ROLE_PERMISSIONS = {
  // ... existing roles
  auditor: ['reports', 'students'],  // New role
};
```

2. **Update backend roles** (`app/services/role_service.py`):

```python
DEFAULT_ROLES = {
    'admin': ['read', 'write', 'delete', 'user_management'],
    'auditor': ['read', 'reports'],  # New role
}
```

3. **Update role decorators** on relevant endpoints:

```python
@roles_required('admin', 'auditor')
def get_financial_reports():
    pass
```

4. **Test access** through UI and API

## Testing RBAC Implementation

### Unit Tests

File: `src/auth/roleAccess.test.js`

```javascript
describe('RBAC System', () => {
  describe('Bursar Role', () => {
    it('should grant cashbook access', () => {
      expect(canAccessModule('bursar', 'cashbook')).toBe(true);
    });
    
    it('should deny user management', () => {
      expect(canAccessModule('bursar', 'users')).toBe(false);
    });
  });
  
  describe('Role Normalization', () => {
    it('should normalize busar to bursar', () => {
      expect(normalizeRole('busar')).toBe('bursar');
    });
  });
});
```

Run tests:

```bash
npm test -- roleAccess
```

### Integration Testing

Test complete workflows:

```javascript
describe('Bursar Cashbook Access', () => {
  it('should allow bursar to view and create transactions', async () => {
    // 1. Login as bursar
    await login('bursar', 'password');
    
    // 2. Navigate to cashbook
    await navigate('/cashbook');
    
    // 3. Verify page loads
    expect(screen.getByText('Cashbook')).toBeInTheDocument();
    
    // 4. Create transaction
    await fillForm({ type: 'expense', amount: 1000 });
    await submit();
    
    // 5. Verify transaction appears
    expect(screen.getByText('1000')).toBeInTheDocument();
  });
  
  it('should deny bursar user management access', async () => {
    await login('bursar', 'password');
    // Access denied when navigating to /users
    expect(window.location.pathname).not.toBe('/users');
  });
});
```

## Audit Trail for RBAC

Important: All role-based actions should be logged for compliance:

```python
# Backend: Log who did what with what role
@app.route('/api/transactions', methods=['POST'])
@jwt_required()
@roles_required('admin', 'bursar')
def create_transaction():
    user_id = get_jwt_identity()
    current_user = get_current_user()
    
    transaction = save_transaction(request.json)
    
    # Log action
    audit_log.create(
        user_id=user_id,
        action='CREATE_TRANSACTION',
        role=current_user.role,
        resource_id=transaction.id,
        timestamp=datetime.now()
    )
    
    return transaction
```

## RBAC Deployment Considerations

### Production Checklist

- All roles defined in both frontend and backend
- Role-based decorators on all sensitive endpoints
- Frontend and backend RBAC matrices synchronized
- Test each role workflow end-to-end
- Configure audit logging for role-based actions
- Set up monitoring for unauthorized access attempts
- Document role responsibilities for admins

### Role Assignment

```bash
# Backend: Assign role to user
```python
user = User.query.filter_by(email='john@school.edu').first()
user.role = 'bursar'
db.session.commit()
```

### Monitoring Unauthorized Access

Track in logs:

```
403 Forbidden - User: teacher@school.edu Role: teacher Endpoint: /api/users
```

Set up alerts for repeated 403 errors on critical endpoints.

## Common RBAC Patterns

### Progressive Disclosure

Show more options as role increases:

```javascript
const roleCapabilities = {
  clerk: ['view'],
  storekeeper: ['view', 'create'],
  bursar: ['view', 'create', 'edit', 'delete'],
  admin: ['view', 'create', 'edit', 'delete', 'audit'],
};

{roleCapabilities[role].includes('edit') && <EditButton />}
```

### Workflow Approval Based on Role

```javascript
if (role === 'admin') {
  // Can approve directly
  approveTransaction();
} else if (role === 'bursar') {
  // Must request approval
  requestApproval();
}
```

### Escalation Path

```javascript
const canEscalateTo = {
  'storekeeper': ['bursar', 'admin'],
  'bursar': ['admin'],
  'admin': [],
};
```

## Reference

See `src/auth/roleAccess.js` for implementation details.

See backend `app/decorators.py` for server-side role enforcement.
