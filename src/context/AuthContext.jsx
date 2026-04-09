import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('erp_token');
      const storedUser = localStorage.getItem('erp_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      console.info('[AuthContext] Login attempt started', { identifier });
      const response = await apiClient.post('/api/auth/login', { identifier, password });
      const { access_token, user: userData } = response.data;

      if (!access_token || !userData) {
        throw new Error('Authentication response was invalid.');
      }

      // Save to local storage for persistence across refreshes
      localStorage.setItem('erp_token', access_token);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      
      setUser(userData);
      const mustChangePassword =
        Boolean(response.data?.must_change_password) ||
        Boolean(userData?.must_change_password) ||
        Boolean(userData?.force_password_change);

      return { success: true, role: userData.role, mustChangePassword };
    } catch (error) {
      console.error('[AuthContext] Login failed', {
        identifier,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        message: error?.message,
      });

      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Authentication failed. Server unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateLocalUser = (updates) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const mergedUser = { ...previousUser, ...updates };
      localStorage.setItem('erp_user', JSON.stringify(mergedUser));
      return mergedUser;
    });
  };

  if (isLoading) return <div className="min-h-screen bg-structural-navy"></div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
