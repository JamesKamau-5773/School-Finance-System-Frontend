import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, UserCog, UserPlus, X } from 'lucide-react';
import { useRegisterUser, useUpdateUser } from './hooks/useUsers';
import { getPasswordRuleResults, getPasswordStrength, isPasswordStrong } from '../../utils/passwordValidation';

const roleOptions = [
  'admin',
  'bursar',
  'clerk',
  'storekeeper',
  'principal',
  'system',
  'user',
];

const defaultForm = {
  full_name: '',
  username: '',
  email: '',
  role: 'user',
  password: '',
};

const USERNAME_REQUIREMENT_TEXT = 'Use only letters, numbers, and underscores (_).';

export default function UserFormModal({ isOpen, onClose, initialData }) {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [clientMessage, setClientMessage] = useState('');
  const passwordRuleResults = getPasswordRuleResults(formData.password || '');
  const passwordStrength = getPasswordStrength(formData.password || '');
  const isUsernameValid = /^[A-Za-z0-9_]+$/.test(formData.username.trim());
  const isFormReadyToSubmit =
    formData.full_name.trim().length > 0 &&
    formData.username.trim().length > 0 &&
    isUsernameValid &&
    (isEditMode ? true : isPasswordStrong(formData.password));

  const strengthToneClass =
    passwordStrength.tone === 'strong'
      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
      : passwordStrength.tone === 'fair'
        ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
        : passwordStrength.tone === 'weak'
          ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
          : 'text-slate-300 bg-white/5 border-white/10';

  const {
    mutate: registerUser,
    isPending: isRegistering,
    error: registerError,
    reset: resetCreate,
  } = useRegisterUser();

  const {
    mutate: updateUser,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateUser();

  const isPending = isRegistering || isUpdating;
  const error = registerError || updateError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    resetCreate();
    resetUpdate();
    setClientMessage('');
    setShowPassword(false);

    if (isEditMode) {
      setFormData({
        full_name: initialData.full_name || '',
        username: initialData.username || '',
        email: initialData.email || '',
        role: initialData.role || 'user',
        password: '',
      });
      return;
    }

    setFormData(defaultForm);
  }, [isEditMode, isOpen, initialData, resetCreate, resetUpdate]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const username = formData.username.trim();

    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setClientMessage('Username is invalid. Use letters, numbers, and underscores only.');
      return;
    }

    if (!isEditMode && !isPasswordStrong(formData.password)) {
      setClientMessage('Password does not meet the requirements below. Please update and try again.');
      return;
    }

    setClientMessage('');

    const payload = {
      full_name: formData.full_name.trim(),
      username,
      email: formData.email.trim() || null,
      role: formData.role,
    };

    if (!isEditMode) {
      payload.password = formData.password;
      registerUser(payload, { onSuccess: onClose });
      return;
    }

    updateUser({ id: initialData.id, data: payload }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-structural-navy/90 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-text-border border border-text-border shadow-2xl shadow-black/70 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-text-border/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isEditMode ? <UserCog size={20} className="text-action-mint" /> : <UserPlus size={20} className="text-action-mint" />}
            {isEditMode ? 'Edit User Account' : 'Create User Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-md border border-rose-500/40 bg-rose-500/10 text-rose-400 text-sm font-semibold">
              <div>{error?.response?.data?.error || error?.response?.data?.message || 'Unable to create user. Please review the form and try again.'}</div>
              {Array.isArray(error?.response?.data?.requirements) && error.response.data.requirements.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-rose-300 text-xs space-y-1">
                  {error.response.data.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {clientMessage && (
            <div className="p-3 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm font-semibold">
              {clientMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(event) => setFormData({ ...formData, full_name: event.target.value })}
                className="w-full bg-structural-navy border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-action-mint"
                placeholder="e.g. Jane Akinyi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                className="w-full bg-structural-navy border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-action-mint"
                placeholder="e.g. teacher_001"
              />
              <p className="mt-1 text-[11px] text-slate-500">{USERNAME_REQUIREMENT_TEXT}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                className="w-full bg-structural-navy border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-action-mint"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="w-full bg-structural-navy border border-white/10 px-3 py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-action-mint"
                placeholder="name@school.org"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!isEditMode}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="w-full bg-structural-navy border border-white/10 px-3 py-2.5 pr-12 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-action-mint"
                  placeholder={isEditMode ? 'Leave blank to keep current password' : '••••••••'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-2 bg-structural-navy border border-white/10 rounded-lg p-3">
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
                      className={`flex items-center gap-2 ${rule.passed ? 'text-emerald-300' : 'text-slate-400'}`}
                    >
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${rule.passed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      {rule.label}
                    </li>
                  ))}
                </ul>
                {isEditMode && (
                  <p className="mt-2 text-[11px] text-slate-500">Password reset is handled from the reset-password action in User Management.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <div className="flex flex-col items-end gap-1">
              {!isFormReadyToSubmit && (
                <p className="text-[11px] text-amber-300 font-semibold">
                  {!isUsernameValid ? 'Username must use only letters, numbers, and underscores.' : 'Complete username and password requirements to continue.'}
                </p>
              )}
              <button
                type="submit"
                disabled={isPending || !isFormReadyToSubmit}
                title={!isFormReadyToSubmit ? 'Complete required fields and password rules first' : 'Create User'}
                className="px-4 py-2 rounded-md bg-action-mint text-structural-navy font-bold uppercase tracking-wider disabled:opacity-60 inline-flex items-center gap-2"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                {isEditMode ? 'Save User' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
