export const ROLE_PERMISSIONS = {
  cashbook: ['bursar', 'admin'],
  reports: ['admin', 'principal'],
  fees: ['bursar', 'admin'],
  students: ['admin', 'clerk'],
  users: ['admin'],
  settings: ['admin'],
  inventory: ['admin', 'principal', 'storekeeper'],
};

export const ROLE_HOME_ROUTES = {
  admin: '/cashbook',
  bursar: '/cashbook',
  storekeeper: '/inventory',
  clerk: '/students',
  principal: '/reports',
  system: '/cashbook',
  user: '/cashbook',
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
