import React, { useMemo, useState } from 'react';
import {
  Search,
  UserPlus,
  Users,
  Shield,
  KeyRound,
  Pencil,
  Power,
  Trash2,
  Loader2,
  Lock,
  Save,
} from 'lucide-react';
import UserFormModal from './UserFormModal';
import { useChangePassword } from './hooks/useUsers';
import {
  useDeleteUser,
  useResetUserPassword,
  useUpdateUserStatus,
  useUsers,
} from './hooks/useUsers';
import { getPasswordRuleResults, getPasswordStrength, isPasswordStrong } from '../../utils/passwordValidation';
import PasswordInput from '../../components/PasswordInput';
import PasswordResetModal from '../../components/PasswordResetModal';
import { generateTemporaryPassword } from '../../utils/passwordGenerator';

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const getIdentity = (user) => user.username || user.email || `user-${user.id}`;
const getDisplayName = (user) => user.full_name || user.username || 'Unknown User';
const isActive = (user) => (typeof user.is_active === 'boolean' ? user.is_active : true);

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [resetPasswordModal, setResetPasswordModal] = useState({
    isOpen: false,
    tempPassword: '',
    selectedUser: null,
  });

  const { data: usersResponse, isLoading } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUserStatus, isPending: isToggling } = useUpdateUserStatus();
  const { mutate: resetPassword, isPending: isResetting } = useResetUserPassword();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const passwordRuleResults = getPasswordRuleResults(passwordForm.newPassword || '');
  const passwordStrength = getPasswordStrength(passwordForm.newPassword || '');
  const isPasswordFormReady =
    passwordForm.oldPassword.length > 0 &&
    isPasswordStrong(passwordForm.newPassword) &&
    passwordForm.newPassword !== passwordForm.oldPassword;

  const strengthToneClass =
    passwordStrength.tone === 'strong'
      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
      : passwordStrength.tone === 'fair'
        ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
        : passwordStrength.tone === 'weak'
          ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
          : 'text-slate-300 bg-white/5 border-white/10';

  const users = useMemo(() => normalizeUsers(usersResponse), [usersResponse]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter((user) => {
      const fields = [
        getDisplayName(user),
        getIdentity(user),
        user.email || '',
        user.role || '',
      ];

      return fields.some((field) => field.toLowerCase().includes(term));
    });
  }, [searchTerm, users]);

  const handleDelete = (user) => {
    const confirmed = window.confirm(`Delete user "${getDisplayName(user)}"? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    deleteUser(user.id);
  };

  const handleToggleStatus = (user) => {
    updateUserStatus({ id: user.id, is_active: !isActive(user) });
  };

  const handleResetPassword = (user) => {
    const tempPassword = generateTemporaryPassword();
    setResetPasswordModal({
      isOpen: true,
      tempPassword,
      selectedUser: user,
    });
  };

  const handleConfirmPasswordReset = async (tempPassword) => {
    try {
      const user = resetPasswordModal.selectedUser;
      resetPassword(
        { id: user.id, new_password: tempPassword },
        {
          onSuccess: () => {
            setResetPasswordModal({ isOpen: false, tempPassword: '', selectedUser: null });
          },
        }
      );
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!isPasswordStrong(passwordForm.newPassword)) {
      setPasswordMessage({
        type: 'warning',
        text: 'Your new password does not meet the listed requirements.',
      });
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setPasswordMessage({
        type: 'warning',
        text: 'Your new password must be different from the current password.',
      });
      return;
    }

    changePassword(
      {
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
          setPasswordForm({ oldPassword: '', newPassword: '' });
        },
        onError: (error) => {
          const serverMessage = error?.response?.data?.error || 'Unable to change password right now. Please try again.';
          setPasswordMessage({ type: 'error', text: serverMessage });
        },
      },
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Shield className="text-action-mint" size={28} />
            User Management
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            Create users, assign roles, and manage account access
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all border ${
            activeTab === 'users'
              ? 'bg-text-border/30 text-action-mint border-action-mint/30'
              : 'bg-structural-navy text-slate-300 border-text-border hover:bg-text-border/50'
          }`}
        >
          <Users size={14} className="inline mr-2" /> Users
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all border ${
            activeTab === 'security'
              ? 'bg-text-border/30 text-action-mint border-action-mint/30'
              : 'bg-structural-navy text-slate-300 border-text-border hover:bg-text-border/50'
          }`}
        >
          <Lock size={14} className="inline mr-2" /> Account Security
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
      <>
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl mb-8 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-action-mint" />
          </div>
          <input
            type="text"
            className="w-full bg-structural-navy border border-text-border text-white pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
            placeholder="Search users by name, username, email, role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-3 bg-text-border text-white border border-action-mint/30 hover:bg-text-border/80 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
        >
          <UserPlus size={16} /> New User
        </button>
      </div>

      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 p-0 overflow-hidden rounded-xl">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr className="border-b border-text-border bg-structural-navy/50">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="financial-data text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const active = isActive(user);

                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-sans text-white font-bold text-base">{getDisplayName(user)}</div>
                        <div className="text-xs text-alert-crimson mt-1 font-mono tracking-wider">{getIdentity(user)}</div>
                      </td>

                      <td className="p-4">
                        <span className="bg-white/5 px-2.5 py-1 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 rounded-md">
                          {user.role || 'unassigned'}
                        </span>
                      </td>

                      <td className="p-4 text-slate-300">{user.email || '-'}</td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest border ${
                            active
                              ? 'bg-action-mint/10 text-action-mint border-action-mint/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {active ? 'active' : 'inactive'}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-text-border bg-text-border/20 text-slate-300 hover:bg-text-border/50 hover:text-white transition-all"
                            title="Edit User"
                            aria-label="Edit User"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => handleResetPassword(user)}
                            disabled={isResetting}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-alert-crimson/30 bg-alert-crimson/10 text-alert-crimson hover:bg-alert-crimson/20 transition-all disabled:opacity-50"
                            title="Reset Password"
                            aria-label="Reset Password"
                          >
                            <KeyRound size={14} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={isToggling}
                            className={`h-8 w-8 inline-flex items-center justify-center rounded-md border transition-all disabled:opacity-50 ${
                              active
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                : 'border-action-mint/30 bg-action-mint/10 text-action-mint hover:bg-action-mint/20'
                            }`}
                            title={active ? 'Deactivate User' : 'Activate User'}
                            aria-label={active ? 'Deactivate User' : 'Activate User'}
                          >
                            <Power size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isDeleting}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                            title="Delete User"
                            aria-label="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                    <div className="inline-flex items-center gap-2">
                      <Users size={16} />
                      No user accounts found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Account Security Tab */}
      {activeTab === 'security' && (
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 p-8 rounded-xl">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Change Your Password</h2>
        <p className="text-slate-300 text-sm mb-6">Update your account credentials.</p>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <PasswordInput
            label="Current Password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            placeholder="••••••••"
            id="current-pwd"
            required
          />
          <PasswordInput
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="••••••••"
            id="new-pwd"
            required
          />

          <div className="bg-structural-navy border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-action-mint">Password Requirements</p>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${strengthToneClass}`}>
                {passwordStrength.label} ({passwordStrength.passedCount}/{passwordStrength.total})
              </span>
            </div>
            <ul className="space-y-1 text-[11px]">
              {passwordRuleResults.map((rule) => (
                <li
                  key={rule.id}
                  className={`flex items-center gap-2 ${rule.passed ? 'text-emerald-300' : 'text-slate-300'}`}
                >
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${rule.passed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  {rule.label}
                </li>
              ))}
              <li
                className={`flex items-center gap-2 ${
                  passwordForm.newPassword && passwordForm.oldPassword !== passwordForm.newPassword
                    ? 'text-emerald-300'
                    : 'text-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    passwordForm.newPassword && passwordForm.oldPassword !== passwordForm.newPassword
                      ? 'bg-emerald-400'
                      : 'bg-slate-600'
                  }`}
                />
                Must be different from your current password
              </li>
            </ul>
          </div>

          {passwordMessage.text && (
            <div
              className={`text-sm font-semibold rounded-lg px-3 py-2 border ${
                passwordMessage.type === 'success'
                  ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                  : passwordMessage.type === 'warning'
                    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                    : 'text-rose-300 bg-rose-500/10 border-rose-500/30'
              }`}
            >
              {passwordMessage.text}
            </div>
          )}
          <button
            type="submit"
            disabled={isChangingPassword || !isPasswordFormReady}
            title={!isPasswordFormReady ? 'Password must meet all rules and be different from current password' : 'Update Password'}
            className="px-4 py-2 bg-action-mint text-structural-navy border border-action-mint text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-action-mint transition-all disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
          {!isPasswordFormReady && (
            <p className="text-[11px] text-amber-300 font-semibold">
              Enter current password and satisfy all new-password rules.
            </p>
          )}
        </form>
      </div>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingUser}
      />

      <PasswordResetModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, tempPassword: '', selectedUser: null })}
        onConfirm={handleConfirmPasswordReset}
        userName={resetPasswordModal.selectedUser ? getDisplayName(resetPasswordModal.selectedUser) : ''}
        tempPassword={resetPasswordModal.tempPassword}
        isPending={isResetting}
      />
    </div>
  );
}
