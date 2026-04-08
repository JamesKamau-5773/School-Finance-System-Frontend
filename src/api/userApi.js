import apiClient from './apiClient';

export const userApi = {
  getCurrentProfile: async () => {
    const endpoints = ['/api/auth/me', '/api/auth/profile'];
    let lastError;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  updateCurrentProfile: async ({ data, userId }) => {
    const endpoints = ['/api/auth/me', '/api/auth/profile'];

    if (userId) {
      endpoints.push(`/api/auth/users/${userId}`);
    }

    let lastError;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.patch(endpoint, data);
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error?.response?.status;

        if (status !== 404 && status !== 405) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  getUsers: async () => {
    const response = await apiClient.get('/api/auth/users');
    return response.data;
  },

  registerUser: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  updateUser: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/auth/users/${id}`, data);
    return response.data;
  },

  updateUserStatus: async ({ id, is_active }) => {
    const response = await apiClient.patch(`/api/auth/users/${id}/status`, { is_active });
    return response.data;
  },

  resetUserPassword: async ({ id, new_password }) => {
    const response = await apiClient.post(`/api/auth/users/${id}/reset-password`, { new_password });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/auth/users/${id}`);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.post('/api/auth/change-password', data);
    return response.data;
  },
};
