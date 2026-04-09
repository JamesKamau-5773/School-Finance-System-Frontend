import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Landmark, Calendar, Save, Loader2, Plus, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import { useVoteHeads, useCreateVoteHead, useUpdateVoteHead, useDeleteVoteHead } from '../cashbook/hooks/useCashbook';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('institution');
  const [isSaving, setIsSaving] = useState(false);
  const { data: voteHeadsData = [], isLoading: isLoadingVoteHeads } = useVoteHeads();
  const { mutate: createVoteHead, isPending: isCreatingVoteHead } = useCreateVoteHead();
  const { mutate: updateVoteHead, isPending: isUpdatingVoteHead } = useUpdateVoteHead();
  const { mutate: deleteVoteHead, isPending: isDeletingVoteHead } = useDeleteVoteHead();
  
  const [editingVoteHeadId, setEditingVoteHeadId] = useState(null);
  const [newVoteHead, setNewVoteHead] = useState({ code: '', name: '', percentage: '' });
  const [voteHeadError, setVoteHeadError] = useState('');
  
  const voteHeads = Array.isArray(voteHeadsData) ? voteHeadsData : voteHeadsData?.data || [];

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

  const totalVoteHeadPercentage = voteHeads.reduce((sum, vh) => sum + (vh.percentage || 0), 0);

  const handleAddVoteHead = (e) => {
    e.preventDefault();
    setVoteHeadError('');

    const normalizedCode = newVoteHead.code.trim().toUpperCase();
    if (!normalizedCode) {
      setVoteHeadError('Vote Head code is required.');
      return;
    }

    if (!newVoteHead.name.trim()) {
      setVoteHeadError('Vote Head name is required.');
      return;
    }

    const percentage = Number(newVoteHead.percentage);
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      setVoteHeadError('Percentage must be between 1 and 100.');
      return;
    }

    if (editingVoteHeadId) {
      updateVoteHead(
        {
          id: editingVoteHeadId,
          data: { code: normalizedCode, name: newVoteHead.name.trim(), percentage },
        },
        {
          onSuccess: () => {
            setNewVoteHead({ code: '', name: '', percentage: '' });
            setEditingVoteHeadId(null);
          },
          onError: (error) => {
            const message =
              error?.response?.data?.message ||
              error?.response?.data?.msg ||
              'Failed to update vote head.';
            setVoteHeadError(message);
          },
        }
      );
    } else {
      createVoteHead(
        { code: normalizedCode, name: newVoteHead.name.trim(), percentage },
        {
          onSuccess: () => {
            setNewVoteHead({ code: '', name: '', percentage: '' });
          },
          onError: (error) => {
            const message =
              error?.response?.data?.message ||
              error?.response?.data?.msg ||
              'Failed to create vote head.';
            setVoteHeadError(message);
          },
        }
      );
    }
  };

  const handleEditVoteHead = (vh) => {
    setNewVoteHead({ code: vh.code || '', name: vh.name, percentage: vh.percentage });
    setEditingVoteHeadId(vh.id || vh.code);
    setVoteHeadError('');
  };

  const handleDeleteVoteHead = (id) => {
    if (window.confirm('Are you sure you want to delete this vote head? This action cannot be undone.')) {
      deleteVoteHead(id, {
        onError: () => setVoteHeadError('Failed to delete vote head.'),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingVoteHeadId(null);
    setNewVoteHead({ code: '', name: '', percentage: '' });
    setVoteHeadError('');
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
          <button 
            onClick={() => setActiveTab('voteheads')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all border ${
              activeTab === 'voteheads' 
                ? 'bg-text-border/30 text-action-mint border-action-mint/30' 
                : 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Landmark size={18} /> Vote Head Config
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

          {/* TAB: Vote Head Configuration */}
          {activeTab === 'voteheads' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Ministry Statutory Vote Heads</h2>
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6 text-sm text-blue-200">
                <strong>Note:</strong> Configure vote head names and their statutory allocation percentages based on the latest Ministry of Education directive. Percentages must total 100%.
              </div>

              {/* Vote Head List */}
              <div className="space-y-4 mb-8">
                {isLoadingVoteHeads ? (
                  <div className="text-center text-slate-400 py-8">Loading vote heads...</div>
                ) : voteHeads.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">No vote heads configured yet. Add one below.</div>
                ) : (
                  <div className="bg-structural-navy/50 rounded-lg overflow-hidden border border-white/10">
                    {voteHeads.map((vh) => {
                      const voteHeadIdentifier = vh.id || vh.code;
                      return (
                      <div key={voteHeadIdentifier} className="flex items-center justify-between p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white">{vh.name}</div>
                          <div className="text-xs text-slate-500 mt-1 font-mono">Code: {vh.code || '-'}</div>
                          <div className="text-xs text-slate-400 mt-1">Allocation: {vh.percentage}%</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVoteHead(vh)}
                            disabled={isUpdatingVoteHead || isDeletingVoteHead}
                            className="p-2 bg-action-mint/10 hover:bg-action-mint/20 text-action-mint rounded-lg transition-colors disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVoteHead(voteHeadIdentifier)}
                            disabled={isDeletingVoteHead || isUpdatingVoteHead}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Percentage Total Indicator */}
              <div className={`p-3 rounded-lg border flex items-center gap-2 text-sm font-bold ${ 
                totalVoteHeadPercentage === 100 
                  ? 'bg-action-mint/10 border-action-mint/50 text-action-mint' 
                  : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300'
              }`}>
                <AlertCircle size={16} />
                Total Allocation: {totalVoteHeadPercentage}% (Must be 100%)
              </div>

              {/* Add/Edit Vote Head Form */}
              <form onSubmit={handleAddVoteHead} className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  {editingVoteHeadId ? <Edit2 size={16} /> : <Plus size={16} />}
                  {editingVoteHeadId ? 'Update Vote Head' : 'Add New Vote Head'}
                </h3>

                {voteHeadError && (
                  <div className="flex gap-2 bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{voteHeadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vote Head Code</label>
                    <input
                      type="text"
                      className="w-full bg-structural-navy border border-text-border text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg font-mono uppercase"
                      placeholder="e.g. TUITION"
                      value={newVoteHead.code}
                      onChange={(e) => setNewVoteHead({ ...newVoteHead, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vote Head Name</label>
                    <input
                      type="text"
                      className="w-full bg-structural-navy border border-text-border text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                      placeholder="e.g. Tuition, RMI, Activity"
                      value={newVoteHead.name}
                      onChange={(e) => setNewVoteHead({ ...newVoteHead, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Allocation %</label>
                    <input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      className="w-full bg-structural-navy border border-text-border text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                      placeholder="e.g. 45"
                      value={newVoteHead.percentage}
                      onChange={(e) => setNewVoteHead({ ...newVoteHead, percentage: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  {editingVoteHeadId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isCreatingVoteHead || isUpdatingVoteHead}
                      className="px-4 py-2 text-slate-300 hover:text-white text-sm font-bold uppercase border border-white/10 rounded-lg transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isCreatingVoteHead || isUpdatingVoteHead}
                    className="px-4 py-2 bg-action-mint text-structural-navy text-sm font-bold uppercase rounded-lg hover:bg-action-mint/80 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCreatingVoteHead || isUpdatingVoteHead ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {editingVoteHeadId ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingVoteHeadId ? (
                      'Update Vote Head'
                    ) : (
                      'Add Vote Head'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}