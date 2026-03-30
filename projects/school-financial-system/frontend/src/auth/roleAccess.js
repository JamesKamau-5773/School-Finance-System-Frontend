export const ROLE_PERMISSIONS = {
  cashbook: ['finance_officer', 'accountant', 'admin'],
  reports: ['finance_officer', 'accountant', 'admin', 'principal', 'teacher', 'student'],
  fees: ['finance_officer', 'admin'],
  students: ['admin', 'clerk'],
  users: ['admin'],
  settings: ['admin'],
  inventory: ['admin', 'principal', 'storekeeper', 'accountant'],
};

export const ROLE_HOME_ROUTES = {
  admin: '/cashbook',
  finance_officer: '/cashbook',
  accountant: '/cashbook',
  storekeeper: '/inventory',
  clerk: '/students',
  principal: '/reports',
  teacher: '/reports',
  student: '/reports',
};

export const canAccessModule = (role, moduleKey) => {
  if (!role || !moduleKey) {
    return false;
  }

  return ROLE_PERMISSIONS[moduleKey]?.includes(role) || false;
};

export const getHomeRouteForRole = (role) => {
  if (!role) {
    return '/login';
  }

  return ROLE_HOME_ROUTES[role] || '/cashbook';
};
