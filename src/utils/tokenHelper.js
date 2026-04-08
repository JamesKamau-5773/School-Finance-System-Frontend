/**
 * Token Helper - Utilities for managing JWT tokens in development
 * 
 * Usage:
 * 1. In browser console: copy the token from terminal
 * 2. localStorage.setItem('access_token', '<full JWT token>')
 * 3. window.location.reload()
 * 
 * Or use this helper:
 * import { setToken } from './utils/tokenHelper'
 * setToken('<jwt token>')
 */

export const getToken = () => {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('jwt')
  );
};

export const setToken = (token) => {
  localStorage.setItem('access_token', token);
  console.log('[OK] Token saved to localStorage.access_token');
  console.log('Refresh the page to use the new token');
  return token;
};

export const clearToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('jwt');
  console.log('[OK] Token cleared from localStorage');
};

export const getTokenInfo = () => {
  const token = getToken();
  if (!token) {
    console.log('[ERROR] No token found in localStorage');
    return null;
  }
  
  // JWT format: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('[ERROR] Invalid token format');
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(parts[1]));
    console.log('[OK] Token info:', {
      role: payload.role,
      expiration: new Date(payload.exp * 1000),
      isExpired: Date.now() > payload.exp * 1000,
    });
    return payload;
  } catch (e) {
    console.log('[ERROR] Could not decode token: ', e.message);
    return null;
  }
};

export const generateTokenPrompt = (token) => {
  return `
╔════════════════════════════════════════════════════════════════════════════╗
║                     JWT Token Setup Instructions                          ║
╚════════════════════════════════════════════════════════════════════════════╝

Option 1: Manual localStorage insertion (Recommended for testing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open Browser DevTools (F12)
2. Go to "Application" tab → "Local Storage" → "http://localhost:5173"
3. Click "Create new entry"
   Key:   access_token
   Value: ${token}
4. Press Enter to save
5. Refresh the page (F5)
6. Try inventory operations - should now work with 200 OK

Option 2: Paste this in browser console (F12 → Console tab)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
localStorage.setItem('access_token', '${token}');
location.reload();

Option 3: Use import statement (if in a component)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { setToken } from './utils/tokenHelper'
setToken('${token}')

[OK] Token Details:
  * User: storekeeper
  * Role: storekeeper  
  * Expires: 1 hour from generation
  * Format: JWT (Header.Payload.Signature)

[INFO] Test with inventory operations:
  * POST /api/inventory/items (Create item)
  * GET /api/inventory/status (Check inventory)
  * POST /api/inventory/add-stock (Add stock)
  
════════════════════════════════════════════════════════════════════════════════
`;
};
