# Features Documentation

## Cashbook Management

### Overview

The Cashbook module provides comprehensive financial transaction tracking with real-time balance management.

### Key Features

1. **Transaction Recording**
   - Income: Capitation, Levies, Donations, Other
   - Expenses: Staff costs, Supplies, Maintenance, Other
   - Payments: Student fees collection

2. **Vote Head Distribution**
   - Allocate funds to different budget categories
   - Track utilization per vote head
   - View vote head balances

3. **Real-Time Balance**
   - Current school account balance
   - Total debits and credits
   - Historical balance trends

### Workflow

```
Login as Bursar
  |
  v
Navigate to Cashbook
  |
  v
Option 1: Recording Transaction
  - Click "Record Transaction"
  - Select type (Income/Expense/Payment)
  - Enter amount and description
  - Save
  
Option 2: Reallocate Funds
  - Click "Reallocate"
  - Select source and target vote heads
  - Enter amount
  - Confirm
```

### Permissions

- Admin: Full access (create, read, update, delete)
- Bursar: Full access
- Principal: Full access

## Fee Master Configuration

### Overview

Configure fees, levies, and charges applicable to students.

### Features

1. **Fee Management**
   - Create standard fees (tuition, boarding, etc.)
   - Define fee amounts and categories
   - Set applicable grades/classes
   - Activate/deactivate fees

2. **Levy Creation**
   - Create optional levies
   - Assign to specific student groups
   - Track levy collections

3. **Fee Tracking**
   - View fee collection status
   - Generate outstanding fees report
   - Track payment history

### Workflow

```
Navigate to Fee Master
  |
  v
View existing fees
  |
  v
Create new levy
  - Enter levy name and amount
  - Select applicable grades
  - Save
  
Apply to students
  - Generate bills
  - Track collections
```

### Permissions

- Admin: Full access
- Bursar: Full access
- Principal: Full access

## Student Directory

### Overview

Centralized student database with payment tracking and profile management.

### Features

1. **Student Records**
   - Full name, admission number
   - Contact information
   - Class/Grade assignment
   - Status (Active/Inactive)

2. **Payment Processing**
   - Record student fee payments
   - Update payment status
   - Print payment receipts
   - View payment history

3. **Search and Filter**
   - Search by name or admission number
   - Filter by class
   - Filter by payment status

### Workflow

```
Navigate to Student Directory
  |
  v
Search for student
  - Enter name or admission number
  - Filter by class
  
Click on student
  |
  v
View profile
  - Name, admission number
  - Current balance
  - Payment history
  
Record Payment
  - Click "Receive Payment"
  - Enter amount and reference
  - Generate receipt
```

### Permissions

- Admin: Full access
- Bursar: Full access
- Principal: Read only
- Clerk: Read and limited edit

## Inventory Management

### Overview

Track school inventory (furniture, equipment, supplies) with stock transactions.

### Features

1. **Inventory Dashboard**
   - Current stock levels
   - Low stock alerts
   - Commodity status

2. **Stock Transactions**
   - Record stock received
   - Record stock issued
   - Track transfers between locations

3. **Stock Ledger**
   - Complete transaction history
   - Item-wise ledger
   - Historical trends

### Workflow

```
Navigate to Store Keeper
  |
  v
View inventory status
  - Items with quantities
  - Low stock warnings
  
Record Transaction
  - Click "Record Transaction"
  - Select item
  - Enter action (Received/Issued)
  - Enter quantity
  - Enter reference/notes
  - Save

View Store Ledger
  - Complete history
  - Filter by item or date
  - Print reports
```

### Permissions

- Admin: Full access
- Bursar: Full access
- Principal: Read only
- Storekeeper: Full access

### Current Limitations

- Bursar access to inventory status requires backend RBAC fix
- Some endpoints restrict bursar role (not yet updated)

## Financial Reports

### Trial Balance Report

**Purpose:** Generate accounting trial balance for audit purposes.

**Data Shown:**
- All vote heads (budget categories)
- Debits and credits
- Balances
- Total verification

**Report Elements:**

```
Trial Balance as at [DATE]

Vote Head          Debit        Credit       Balance
CAPITATION      500,000.00                  500,000.00
TUITION FEES                  300,000.00   (300,000.00)
EXPENSES        150,000.00                  150,000.00
                ───────────   ───────────   ───────────
TOTALS          650,000.00    300,000.00    350,000.00
```

**Usage:**

```
Navigate to Audit Report
  |
  v
Select Report Type: Trial Balance
  |
  v
Select Date (optional)
  |
  v
View/Print Report
```

**Permissions**

- Admin: Full access
- Bursar: Full access
- Principal: Full access

## User Management

### Overview

Create, edit, and manage system users with role assignments.

### Features

1. **User CRUD**
   - Create new user accounts
   - Edit user information
   - Deactivate users
   - Reset passwords

2. **Role Assignment**
   - Assign role to user
   - Multiple roles (future)
   - Role-based permissions automatic

3. **User Status**
   - Active/Inactive status
   - Last login tracking
   - Password change status

### Workflow

```
Navigate to User Management (Admin only)
  |
  v
View all users
  - Table with email, name, role, status
  
Create User
  - Click "New User"
  - Enter email and name
  - Select role
  - Generate temporary password
  - Send credentials to user
  
Edit User
  - Select user
  - Update information
  - Change role if needed
  - Save

Reset Password
  - Select user
  - Generate temporary password
  - User must change on next login
```

### Permissions

- Admin: Full access only

## Profile Settings

### Overview

User profile management and password updates.

### Features

1. **Profile Information**
   - View personal details
   - Edit contact information
   - Update preferences

2. **Password Management**
   - Change password
   - View password requirements
   - Password visibility toggle

3. **Forced Password Change**
   - First login with temp password
   - Must change before accessing app
   - Enforced by frontend and backend

### Workflow

```
Click "My Profile" in navigation
  |
  v
View profile information
  
Change Password
  - Enter current password
  - Enter new password
  - Confirm new password
  - Show/hide password toggle
  - Submit

On Temporary Password (First Login)
  - Forced to ProfileSettings
  - Notice banner displayed
  - Must change password to continue
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Application Settings

### Overview

Global application configuration.

### Features

1. **System Configuration**
   - School name
   - Financial year settings
   - Currency settings

2. **Notification Settings**
   - Email notifications
   - Payment reminders
   - Report distribution

### Permissions

- Admin: Full access
- Bursar: Full access
- Principal: Full access

## Feature Navigation

### Mobile (Hamburger Menu)

```
Menu (top-left)
├── Cashbook
├── Fee Master
├── Student Directory
├── Store Keeper
├── Store Ledger
├── Audit Report
├── My Profile
├── User Management (admin only)
├── Settings (admin/bursar/principal)
└── Logout
```

### Desktop (Sidebar)

Same menu in fixed left sidebar.

## Feature Permissions Matrix

| Feature | Admin | Bursar | Principal | Storekeeper | Clerk |
|---------|-------|--------|-----------|-------------|-------|
| Cashbook | RWD | RWD | RWD | - | - |
| Fee Master | RWD | RWD | RWD | - | - |
| Student Directory | RWD | RWD | R | - | RW |
| Inventory | RWD | RWD | R | RWD | - |
| Store Ledger | RWD | RWD | R | RWD | - |
| Trial Balance | R | R | R | - | - |
| User Management | RWD | - | - | - | - |
| Settings | RWD | RWD | RWD | - | - |
| My Profile | RWD | RWD | RWD | RWD | RWD |

Legend: R=Read, W=Write, D=Delete, -=No access

## Upcoming Features (Roadmap)

1. **Advanced Reporting**
   - Income and expense summary
   - Student fee analysis
   - Inventory valuation

2. **Budgeting**
   - Budget allocation
   - Budget vs actual comparison
   - Variance analysis

3. **Two-Factor Authentication**
   - SMS or email OTP
   - TOTP authenticator support

4. **Mobile App**
   - Native iOS app
   - Native Android app
   - Offline sync

5. **Advanced Inventory**
   - Item categorization
   - Supplier management
   - Stock reorder alerts

6. **Audit Trail**
   - Complete action history
   - User activity logs
   - Change tracking

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Cashbook | Complete | Fully functional |
| Fee Master | Complete | Fully functional |
| Student Directory | Complete | Fully functional |
| Inventory Status | In Development | Bursar access needs backend fix |
| Store Ledger | Complete | Fully functional |
| Trial Balance Report | Complete | Audit-ready |
| User Management | Complete | Admin only |
| Profile Settings | Complete | Includes password management |
| Mobile Menu | Complete | 9/10 responsive rating |
| Authentication | Complete | Includes 2FA placeholder |
| RBAC | Complete | Frontend complete, backend needs updates |

## Troubleshooting Features

For issues with specific features, see TROUBLESHOOTING.md

Feature-specific support:
- Cashbook: TROUBLESHOOTING.md "Cashbook issues"
- Inventory: TROUBLESHOOTING.md "Inventory access issues"
- Authentication: AUTHENTICATION.md
- Mobile: MOBILE.md
