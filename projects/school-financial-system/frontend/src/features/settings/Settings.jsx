import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Landmark, Calendar, Shield, Save, Loader2 } from 'lucide-react';
import { useChangePassword } from '../users/hooks/useUsers';
import { getPasswordRuleResults, getPasswordStrength, isPasswordStrong } from '../../utils/passwordValidation';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('institution');
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
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

  // Simulated state for system settings
  const [formData, setFormData] = useState({
    schoolName: 'St. Gerald High',
    email: 'finance@stgerald.ac.ke',
    phone: '+254 700 000 000',
    address: 'P.O Box 123 - 20100, Nakuru',
    
    bankName: 'KCB Bank',
    accountName: 'St Gerald Main Collection',
    accountNumber: '1122334455',
    kraPin: 'P051234567Z',
    
    academicYear: '2026',
    currentTerm: 'Term 1'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call to backend
    setTimeout(() => {
      setIsSaving(false);
      alert('System Settings Updated Successfully.');
    }, 1000);
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#1A4D5C]/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <SettingsIcon className="text-[#05CD99]" size={28} />
            System Configurations
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Manage Institution & Global Variables</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#05CD99] text-[#050B14] border border-[#05CD99] text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#04B083] transition-all shadow-[0_4px_14px_0_rgba(5,205,153,0.2)] rounded-lg disabled:opacity-70"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('institution')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'institution' 
                ? 'bg-[#1A4D5C]/30 text-[#05CD99] border-[#05CD99]/30' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building2 size={18} /> Institution Profile
          </button>
          <button 
            onClick={() => setActiveTab('financial')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'financial' 
                ? 'bg-[#1A4D5C]/30 text-[#05CD99] border-[#05CD99]/30' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Landmark size={18} /> Financial Routing
          </button>
          <button 
            onClick={() => setActiveTab('academic')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'academic' 
                ? 'bg-[#1A4D5C]/30 text-[#05CD99] border-[#05CD99]/30' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Calendar size={18} /> Academic Cycle
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'security' 
                ? 'bg-[#1A4D5C]/30 text-[#05CD99] border-[#05CD99]/30' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Shield size={18} /> Access & Security
          </button>
        </div>

        {/* Configuration Forms Area */}
        <div className="flex-1 bg-[#0B192C] border border-[#1A4D5C] shadow-2xl shadow-black/50 p-8 rounded-xl">
          
          {/* TAB: Institution Profile */}
          {activeTab === 'institution' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Institution Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">School/Institution Name</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Official Email</label>
                  <input type="email" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Postal Address</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Financial Routing */}
          {activeTab === 'financial' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                Bank & Tax Details <span className="text-xs text-slate-500 font-normal">(Appears on Invoices)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Bank Name</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Name</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg" 
                    value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Number</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-rose-400 font-bold px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg tracking-wider" 
                    value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">KRA PIN</label>
                  <input type="text" className="w-full bg-[#050B14] border border-[#1A4D5C] text-[#FFC107] font-bold px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg tracking-wider uppercase" 
                    value={formData.kraPin} onChange={(e) => setFormData({...formData, kraPin: e.target.value.toUpperCase()})} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Academic Cycle */}
          {activeTab === 'academic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Global Billing Variables</h2>
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg mb-6 text-sm text-rose-200">
                <strong>Warning:</strong> Changing these variables will directly affect how the Mass Invoicing Engine tags new student debts. Only update these at the beginning of a new term.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Academic Year</label>
                  <select 
                    className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg appearance-none"
                    value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Term</label>
                  <select 
                    className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg appearance-none uppercase font-bold"
                    value={formData.currentTerm} onChange={(e) => setFormData({...formData, currentTerm: e.target.value})}
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Access Control</h2>
              <p className="text-slate-400 text-sm mb-4">Update your administrative credentials.</p>
              
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05CD99] rounded-lg"
                  />
                </div>

                <div className="bg-[#050B14] border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#05CD99]">Password Requirements</p>
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
                    <li
                      className={`flex items-center gap-2 ${
                        passwordForm.newPassword && passwordForm.oldPassword !== passwordForm.newPassword
                          ? 'text-emerald-300'
                          : 'text-slate-400'
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
                  className="px-4 py-2 bg-[#1A4D5C] text-white border border-[#1A4D5C] text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all mt-2 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                  Update Password
                </button>
                {!isPasswordFormReady && (
                  <p className="text-[11px] text-amber-300 font-semibold">
                    Enter current password and satisfy all new-password rules.
                  </p>
                )}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}