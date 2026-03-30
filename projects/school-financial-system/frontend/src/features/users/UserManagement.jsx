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
} from 'lucide-react';
import UserFormModal from './UserFormModal';
import {
  useDeleteUser,
  useResetUserPassword,
  useUpdateUserStatus,
  useUsers,
} from './hooks/useUsers';

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

  const { data: usersResponse, isLoading } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUserStatus, isPending: isToggling } = useUpdateUserStatus();
  const { mutate: resetPassword, isPending: isResetting } = useResetUserPassword();

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
    const newPassword = window.prompt(`Enter a new password for ${getDisplayName(user)}:`);

    if (!newPassword) {
      return;
    }

    resetPassword({ id: user.id, new_password: newPassword });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#1A4D5C]/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Shield className="text-[#05CD99]" size={28} />
            User Management
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            Create users, assign roles, and manage account access
          </p>
        </div>
      </div>

      <div className="bg-[#0B192C] border border-[#1A4D5C] shadow-2xl shadow-black/50 rounded-xl mb-8 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#05CD99]" />
          </div>
          <input
            type="text"
            className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg"
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
          className="px-4 py-3 bg-[#1A4D5C] text-white border border-[#05CD99]/30 hover:bg-[#1A4D5C]/80 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
        >
          <UserPlus size={16} /> New User
        </button>
      </div>

      <div className="bg-[#0B192C] border border-[#1A4D5C] shadow-2xl shadow-black/50 p-0 overflow-hidden rounded-xl">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr className="border-b border-[#1A4D5C] bg-[#050B14]/50">
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
                        <div className="text-xs text-[#FFC107] mt-1 font-mono tracking-wider">{getIdentity(user)}</div>
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
                              ? 'bg-[#05CD99]/10 text-[#05CD99] border-[#05CD99]/30'
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
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[#1A4D5C] bg-[#1A4D5C]/20 text-slate-300 hover:bg-[#1A4D5C]/50 hover:text-white transition-all"
                            title="Edit User"
                            aria-label="Edit User"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => handleResetPassword(user)}
                            disabled={isResetting}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[#FFC107]/30 bg-[#FFC107]/10 text-[#FFC107] hover:bg-[#FFC107]/20 transition-all disabled:opacity-50"
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
                                : 'border-[#05CD99]/30 bg-[#05CD99]/10 text-[#05CD99] hover:bg-[#05CD99]/20'
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingUser}
      />
    </div>
  );
}
