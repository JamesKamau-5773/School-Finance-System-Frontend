import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../../api/userApi';

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });

export const useCurrentProfile = () =>
  useQuery({
    queryKey: ['current-profile'],
    queryFn: userApi.getCurrentProfile,
    retry: 0,
  });

export const useRegisterUser = () =>
  useMutation({
    mutationFn: userApi.registerUser,
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUserStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.resetUserPassword,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: userApi.changePassword,
  });

export const useUpdateCurrentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateCurrentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
