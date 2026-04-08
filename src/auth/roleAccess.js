export const ROLE_PERMISSIONS = {
  cashbook: ['admin', 'bursar', 'principal'],
  reports: ['admin', 'bursar', 'principal'],
  fees: ['admin', 'bursar', 'principal'],
  students: ['admin', 'bursar', 'principal', 'clerk'],
  users: ['admin'],
  settings: ['admin', 'bursar', 'principal'],
  inventory: ['admin', 'bursar', 'principal', 'storekeeper'],
};

export const ROLE_HOME_ROUTES = {
  admin: '/cashbook',
  bursar: '/cashbook',
  busar: '/cashbook',
  storekeeper: '/inventory',
  clerk: '/students',
  principal: '/reports',
  system: '/cashbook',
  user: '/cashbook',
};

const normalizeRole = (role) => {
  if (!role) {
    return role;
  }

  return role === 'busar' ? 'bursar' : role;
};

export const canAccessModule = (role, moduleKey) => {
  if (!role || !moduleKey) {
    return false;
  }

  const normalizedRole = normalizeRole(role);
  return ROLE_PERMISSIONS[moduleKey]?.includes(normalizedRole) || false;
};

export const getHomeRouteForRole = (role) => {
  if (!role) {
    return '/login';
  }

  const normalizedRole = normalizeRole(role);
  return ROLE_HOME_ROUTES[normalizedRole] || '/cashbook';
};
