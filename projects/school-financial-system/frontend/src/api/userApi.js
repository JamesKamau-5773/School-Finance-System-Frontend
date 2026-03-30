import apiClient from './apiClient';

export const userApi = {
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
