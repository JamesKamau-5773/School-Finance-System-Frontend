import React, { useMemo, useState } from 'react';
import { Loader2, Save, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChangePassword, useCurrentProfile, useUpdateCurrentProfile } from '../users/hooks/useUsers';
import { getPasswordRuleResults, getPasswordStrength, isPasswordStrong } from '../../utils/passwordValidation';
import PasswordInput from '../../components/PasswordInput';

const normalizeProfilePayload = (payload) => {
  if (!payload) return null;
  if (payload.user) return payload.user;
  if (payload.data) return payload.data;
  return payload;
};

export default function ProfileSettings() {
  const { user, updateLocalUser } = useAuth();
  const location = useLocation();
  const { data: profileResponse } = useCurrentProfile();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateCurrentProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const profile = useMemo(() => {
    const normalized = normalizeProfilePayload(profileResponse);
    return normalized || user || {};
  }, [profileResponse, user]);

  const [profileForm, setProfileForm] = useState({
    full_name: profile.full_name || '',
    username: profile.username || '',
    email: profile.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  React.useEffect(() => {
    setProfileForm({
      full_name: profile.full_name || '',
      username: profile.username || '',
      email: profile.email || '',
    });
  }, [profile.full_name, profile.username, profile.email]);

  const passwordRuleResults = getPasswordRuleResults(passwordForm.newPassword || '');
  const passwordStrength = getPasswordStrength(passwordForm.newPassword || '');

  const isProfileFormValid = profileForm.full_name.trim() && profileForm.username.trim();
  const isPasswordFormReady =
    passwordForm.oldPassword.length > 0 &&
    isPasswordStrong(passwordForm.newPassword) &&
    passwordForm.oldPassword !== passwordForm.newPassword;

  const strengthClass =
    passwordStrength.tone === 'strong'
      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
      : passwordStrength.tone === 'fair'
        ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
        : passwordStrength.tone === 'weak'
          ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
          : 'text-slate-300 bg-white/5 border-white/10';

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setProfileMessage({ type: '', text: '' });

    if (!isProfileFormValid) {
      setProfileMessage({ type: 'error', text: 'Full name and username are required.' });
      return;
    }

    const payload = {
      full_name: profileForm.full_name.trim(),
      username: profileForm.username.trim(),
      email: profileForm.email.trim() || null,
    };

    updateProfile(
      { data: payload, userId: profile.id || user?.id },
      {
        onSuccess: (result) => {
          const nextUser = normalizeProfilePayload(result) || payload;
          updateLocalUser(nextUser);
          setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
        },
        onError: (error) => {
          const message =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Unable to update profile right now.';
          setProfileMessage({ type: 'error', text: message });
        },
      },
    );
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!isPasswordStrong(passwordForm.newPassword)) {
      setPasswordMessage({ type: 'error', text: 'New password does not meet requirements.' });
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setPasswordMessage({ type: 'error', text: 'New password must be different from current password.' });
      return;
    }

    changePassword(
      {
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordForm({ oldPassword: '', newPassword: '' });
          setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
        },
        onError: (error) => {
          const message =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Unable to change password right now.';
          setPasswordMessage({ type: 'error', text: message });
        },
      },
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <UserCircle2 className="text-action-mint" size={28} />
            My Profile
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            View and update your account details
          </p>
        </div>
      </div>

      {(location.state?.forcePasswordChange || profile.must_change_password) && (
        <div className="mb-6 border border-amber-500/40 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg text-sm font-semibold">
          {location.state?.notice || 'Your account requires a password update before normal use.'}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Profile Information</h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Role</label>
              <input
                type="text"
                value={profile.role || user?.role || 'user'}
                className="w-full bg-structural-navy border border-text-border/60 text-slate-300 px-4 py-2.5 text-sm font-sans rounded-lg cursor-not-allowed"
                disabled
              />
            </div>

            {profileMessage.text && (
              <div
                className={`p-3 rounded-md border text-sm font-semibold ${
                  profileMessage.type === 'success'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdatingProfile || !isProfileFormValid}
              className="px-4 py-2 bg-action-mint text-structural-navy border border-action-mint text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-lg disabled:opacity-60"
            >
              {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Profile
            </button>
          </form>
        </section>

        <section className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="text-action-mint" size={18} />
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <PasswordInput
              label="Current Password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              placeholder="••••••••"
              id="current-password"
              required
            />

            <PasswordInput
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="••••••••"
              id="new-password"
              required
            />

            <div className="bg-structural-navy border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-action-mint">Password Requirements</p>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${strengthClass}`}>
                  {passwordStrength.label} ({passwordStrength.passedCount}/{passwordStrength.total})
                </span>
              </div>
              <ul className="space-y-1 text-[11px]">
                {passwordRuleResults.map((rule) => (
                  <li key={rule.id} className={`flex items-center gap-2 ${rule.passed ? 'text-emerald-300' : 'text-slate-400'}`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${rule.passed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            {passwordMessage.text && (
              <div
                className={`p-3 rounded-md border text-sm font-semibold ${
                  passwordMessage.type === 'success'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPassword || !isPasswordFormReady}
              className="px-4 py-2 bg-text-border text-white border border-action-mint/30 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-lg disabled:opacity-60"
            >
              {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Update Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
