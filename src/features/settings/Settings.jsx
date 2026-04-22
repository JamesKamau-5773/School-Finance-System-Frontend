import React, { useMemo, useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Landmark,
  Calendar,
  Save,
  Loader2,
  PieChart,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import {
  useVoteHeads,
  useCreateVoteHead,
  useUpdateVoteHead,
  useDeleteVoteHead,
} from '../cashbook/hooks/useCashbook';

const MOE_STANDARD_VOTE_HEADS = [
  { name: 'Lunch programme', percentage: 22 },
  { name: 'Repair, Maintenance & Improvement RMI', percentage: 10 },
  { name: 'Local Traveling & Transport', percentage: 5 },
  { name: 'Administrative Cost', percentage: 8 },
  { name: 'Medical Fees', percentage: 5 },
  { name: 'Electricity Water & Conservancy EW&C', percentage: 14 },
  { name: 'Activity fund', percentage: 8 },
  { name: 'Personal Emolument', percentage: 10 },
  { name: 'Insurance', percentage: 4 },
  { name: 'Student ID', percentage: 2 },
  { name: 'Caution Money', percentage: 3 },
  { name: 'Fees Arrears', percentage: 7 },
  { name: 'Others (Specify)', percentage: 2 },
];

const normalizeVoteHeadName = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export default function Settings() {
  const [activeTab, setActiveTab] = useState('institution');
  const [isSaving, setIsSaving] = useState(false);
  const [voteHeadForm, setVoteHeadForm] = useState({ name: '', percentage: '' });
  const [editingVoteHeadId, setEditingVoteHeadId] = useState(null);
  const [voteHeadFeedback, setVoteHeadFeedback] = useState('');

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

  const { data: voteHeadResponse, isLoading: isLoadingVoteHeads } = useVoteHeads();
  const {
    mutateAsync: createVoteHead,
    isPending: isCreatingVoteHead,
  } = useCreateVoteHead();
  const {
    mutateAsync: updateVoteHead,
    isPending: isUpdatingVoteHead,
  } = useUpdateVoteHead();
  const {
    mutateAsync: deleteVoteHead,
    isPending: isDeletingVoteHead,
  } = useDeleteVoteHead();

  const isMutatingVoteHeads =
    isCreatingVoteHead || isUpdatingVoteHead || isDeletingVoteHead;

  const voteHeads = useMemo(() => {
    const raw = Array.isArray(voteHeadResponse)
      ? voteHeadResponse
      : Array.isArray(voteHeadResponse?.data)
        ? voteHeadResponse.data
        : [];

    return raw
      .map((item) => {
        const name = item?.name || item?.vote_head || item?.title || item?.label || '';
        const id = item?.id || item?.vote_head_id || item?.uuid || name;
        const percentage = Number(
          item?.percentage ?? item?.allocation_percentage ?? item?.moe_percentage ?? 0,
        ) || 0;

        return {
          id,
          name,
          percentage,
          current_balance: Number(item?.current_balance || 0) || 0,
        };
      })
      .filter((item) => item.name);
  }, [voteHeadResponse]);

  const totalPercentage = voteHeads.reduce(
    (sum, voteHead) => sum + (Number(voteHead.percentage || 0) || 0),
    0,
  );

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call to backend
    setTimeout(() => {
      setIsSaving(false);
      alert('System Settings Updated Successfully.');
    }, 1000);
  };

  const resetVoteHeadForm = () => {
    setVoteHeadForm({ name: '', percentage: '' });
    setEditingVoteHeadId(null);
  };

  const handleVoteHeadSubmit = async (event) => {
    event.preventDefault();

    const name = voteHeadForm.name.trim();
    const percentage = Number(voteHeadForm.percentage || 0);

    if (!name) {
      setVoteHeadFeedback('Vote head name is required.');
      return;
    }

    if (percentage < 0 || percentage > 100) {
      setVoteHeadFeedback('Percentage must be between 0 and 100.');
      return;
    }

    const payload = {
      name,
      vote_head: name,
      percentage,
      allocation_percentage: percentage,
    };

    try {
      if (editingVoteHeadId) {
        await updateVoteHead({ id: editingVoteHeadId, data: payload });
        setVoteHeadFeedback('Vote head updated successfully.');
      } else {
        await createVoteHead(payload);
        setVoteHeadFeedback('Vote head created successfully.');
      }

      resetVoteHeadForm();
    } catch (error) {
      setVoteHeadFeedback(error?.response?.data?.message || 'Unable to save vote head.');
    }
  };

  const handleVoteHeadEdit = (voteHead) => {
    setEditingVoteHeadId(voteHead.id);
    setVoteHeadForm({
      name: voteHead.name,
      percentage: String(voteHead.percentage ?? ''),
    });
    setVoteHeadFeedback('');
  };

  const handleVoteHeadDelete = async (voteHead) => {
    const shouldDelete = window.confirm(
      `Delete vote head "${voteHead.name}"? This action cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      await deleteVoteHead(voteHead.id);
      setVoteHeadFeedback('Vote head deleted successfully.');

      if (editingVoteHeadId === voteHead.id) {
        resetVoteHeadForm();
      }
    } catch (error) {
      setVoteHeadFeedback(error?.response?.data?.message || 'Unable to delete vote head.');
    }
  };

  const handleApplyMoeStandards = async () => {
    try {
      const voteHeadsByName = voteHeads.reduce((acc, voteHead) => {
        acc[normalizeVoteHeadName(voteHead.name)] = voteHead;
        return acc;
      }, {});

      for (const standardVoteHead of MOE_STANDARD_VOTE_HEADS) {
        const key = normalizeVoteHeadName(standardVoteHead.name);
        const existing = voteHeadsByName[key];
        const payload = {
          name: standardVoteHead.name,
          vote_head: standardVoteHead.name,
          percentage: standardVoteHead.percentage,
          allocation_percentage: standardVoteHead.percentage,
        };

        if (existing) {
          await updateVoteHead({ id: existing.id, data: payload });
        } else {
          await createVoteHead(payload);
        }
      }

      setVoteHeadFeedback('MoE standard percentages applied to vote heads.');
      resetVoteHeadForm();
    } catch (error) {
      setVoteHeadFeedback(error?.response?.data?.message || 'Failed to apply MoE standards.');
    }
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
            <PieChart size={18} /> Vote Heads & MoE %
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

          {activeTab === 'voteheads' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                    Vote Heads Management
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                    CRUD access for Admin, Principal, and Bursar accounts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyMoeStandards}
                  disabled={isMutatingVoteHeads}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-action-mint/40 text-action-mint hover:bg-action-mint/10 disabled:opacity-60 flex items-center gap-2"
                >
                  {isMutatingVoteHeads ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  Apply MoE Standard %
                </button>
              </div>

              <form onSubmit={handleVoteHeadSubmit} className="grid grid-cols-1 md:grid-cols-[1fr,180px,auto,auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Vote Head Name
                  </label>
                  <input
                    type="text"
                    value={voteHeadForm.name}
                    onChange={(event) =>
                      setVoteHeadForm((previous) => ({ ...previous, name: event.target.value }))
                    }
                    placeholder="e.g. Lunch programme"
                    className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    MoE %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={voteHeadForm.percentage}
                    onChange={(event) =>
                      setVoteHeadForm((previous) => ({ ...previous, percentage: event.target.value }))
                    }
                    placeholder="0"
                    className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isMutatingVoteHeads}
                  className="px-4 py-2.5 bg-action-mint text-structural-navy text-xs font-bold uppercase tracking-wider rounded-lg border border-action-mint disabled:opacity-60 flex items-center gap-2 justify-center"
                >
                  {isMutatingVoteHeads ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {editingVoteHeadId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetVoteHeadForm}
                  className="px-4 py-2.5 bg-transparent text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-text-border hover:bg-white/5"
                >
                  Reset
                </button>
              </form>

              {voteHeadFeedback ? (
                <div className="text-sm text-action-mint bg-action-mint/10 border border-action-mint/30 rounded-lg px-4 py-2">
                  {voteHeadFeedback}
                </div>
              ) : null}

              <div className="bg-structural-navy/45 border border-text-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-text-border flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Configured Vote Heads</span>
                  <span className={`text-xs font-bold ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-action-mint' : 'text-alert-crimson'}`}>
                    Total: {totalPercentage.toFixed(2)}%
                  </span>
                </div>

                {isLoadingVoteHeads ? (
                  <div className="px-4 py-6 text-slate-300 text-sm">Loading vote heads...</div>
                ) : voteHeads.length === 0 ? (
                  <div className="px-4 py-6 text-slate-300 text-sm">No vote heads found. Create one or apply MoE standards.</div>
                ) : (
                  <div className="max-h-[380px] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-black/20 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-2 text-xs text-slate-300 uppercase tracking-wider">Vote Head</th>
                          <th className="text-right px-4 py-2 text-xs text-slate-300 uppercase tracking-wider">MoE %</th>
                          <th className="text-right px-4 py-2 text-xs text-slate-300 uppercase tracking-wider">Balance</th>
                          <th className="text-right px-4 py-2 text-xs text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voteHeads.map((voteHead) => (
                          <tr key={voteHead.id} className="border-t border-white/5">
                            <td className="px-4 py-2 text-white font-medium">{voteHead.name}</td>
                            <td className="px-4 py-2 text-right font-mono text-action-mint">{Number(voteHead.percentage || 0).toFixed(2)}%</td>
                            <td className="px-4 py-2 text-right font-mono text-slate-300">
                              {Number(voteHead.current_balance || 0).toLocaleString('en-KE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleVoteHeadEdit(voteHead)}
                                  className="p-2 rounded-lg border border-white/10 text-slate-200 hover:text-action-mint hover:border-action-mint/40"
                                  title="Edit vote head"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVoteHeadDelete(voteHead)}
                                  className="p-2 rounded-lg border border-white/10 text-slate-200 hover:text-alert-crimson hover:border-alert-crimson/40"
                                  title="Delete vote head"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}