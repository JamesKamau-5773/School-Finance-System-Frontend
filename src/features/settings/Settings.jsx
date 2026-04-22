import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Landmark, Calendar, Save, Loader2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('institution');
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <SettingsIcon className="text-action-mint" size={28} />
            System Configurations
          </h1>
          <p className="text-slate-300 font-medium tracking-wide uppercase text-sm">Manage Institution & Global Variables</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-action-mint text-structural-navy border border-action-mint text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-action-mint transition-all shadow-[0_4px_14px_0_rgba(5,205,153,0.2)] rounded-lg disabled:opacity-70"
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
                ? 'bg-text-border/30 text-action-mint border-action-mint/30' 
                : 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building2 size={18} /> Institution Profile
          </button>
          <button 
            onClick={() => setActiveTab('financial')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'financial' 
                ? 'bg-text-border/30 text-action-mint border-action-mint/30' 
                : 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Landmark size={18} /> Financial Routing
          </button>
          <button 
            onClick={() => setActiveTab('academic')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'academic' 
                ? 'bg-text-border/30 text-action-mint border-action-mint/30' 
                : 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Calendar size={18} /> Academic Cycle
          </button>
        </div>

        {/* Configuration Forms Area */}
        <div className="flex-1 bg-text-border border border-text-border shadow-2xl shadow-black/50 p-8 rounded-xl">
          
          {/* TAB: Institution Profile */}
          {activeTab === 'institution' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Institution Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">School/Institution Name</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
                    value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Official Email</label>
                  <input type="email" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Contact Phone</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Postal Address</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
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
                Bank & Tax Details <span className="text-xs text-slate-300 font-normal">(Appears on Invoices)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Primary Bank Name</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
                    value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Account Name</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg" 
                    value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Account Number</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-rose-400 font-bold px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg tracking-wider" 
                    value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">KRA PIN</label>
                  <input type="text" className="w-full bg-structural-navy border border-text-border text-alert-crimson font-bold px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg tracking-wider uppercase" 
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
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Active Academic Year</label>
                  <select 
                    className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg appearance-none"
                    value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Current Term</label>
                  <select 
                    className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg appearance-none uppercase font-bold"
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

        </div>
      </div>
    </div>
  );
}