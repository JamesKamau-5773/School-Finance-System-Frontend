import { canAccessModule, getHomeRouteForRole } from './roleAccess';

describe('roleAccess', () => {
  it('grants bursar all admin modules except users', () => {
    expect(canAccessModule('bursar', 'cashbook')).toBe(true);
    expect(canAccessModule('bursar', 'fees')).toBe(true);
    expect(canAccessModule('bursar', 'reports')).toBe(true);
    expect(canAccessModule('bursar', 'students')).toBe(true);
    expect(canAccessModule('bursar', 'settings')).toBe(true);
    expect(canAccessModule('bursar', 'inventory')).toBe(true);
    expect(canAccessModule('bursar', 'users')).toBe(false);
  });

  it('grants principal all admin modules except users', () => {
    expect(canAccessModule('principal', 'cashbook')).toBe(true);
    expect(canAccessModule('principal', 'fees')).toBe(true);
    expect(canAccessModule('principal', 'reports')).toBe(true);
    expect(canAccessModule('principal', 'students')).toBe(true);
    expect(canAccessModule('principal', 'settings')).toBe(true);
    expect(canAccessModule('principal', 'inventory')).toBe(true);
    expect(canAccessModule('principal', 'users')).toBe(false);
  });

  it('keeps user management restricted to admin', () => {
    expect(canAccessModule('admin', 'users')).toBe(true);
    expect(canAccessModule('bursar', 'users')).toBe(false);
    expect(canAccessModule('principal', 'users')).toBe(false);
    expect(canAccessModule('storekeeper', 'users')).toBe(false);
  });

  it('normalizes busar role alias consistently', () => {
    expect(canAccessModule('busar', 'cashbook')).toBe(true);
    expect(canAccessModule('busar', 'users')).toBe(false);
    expect(getHomeRouteForRole('busar')).toBe('/cashbook');
  });
});
