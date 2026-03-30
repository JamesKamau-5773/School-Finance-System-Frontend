import React, { useState } from 'react';
import { WalletCards, Plus, Users, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useFeeStructures, useIssueInvoices } from './hooks/useFees';
import CreateLevyModal from './CreateLevyModal';

export default function FeeMaster() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: response, isLoading } = useFeeStructures({});
  const { mutate: issueInvoices, isPending, variables: pendingId } = useIssueInvoices();

  const fees = response?.data || [];

  const handleIssueInvoices = (fee) => {
    if (window.confirm(`Are you sure you want to bill ${fee.target_cohort} for the ${fee.name}? This will update student ledgers immediately.`)) {
      issueInvoices(fee.id, {
        onSuccess: (res) => {
          setSuccessMessage(res.data.message);
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <WalletCards className="text-[#FFC107]" size={28} />
            Fee Master
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">BOM Levies & Cohort Billing Engine</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="edtech-btn"
        >
          <Plus size={18} />
          Define New Levy
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* Catalog Table */}
      <div className="edtech-card p-0 overflow-hidden shadow-2xl shadow-black/50">
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">Active Fee Structures (2026)</h3>
        </div>

        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-white/10 bg-black/40">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Levy Name</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Target Cohort</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Term</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount (KES)</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Billing Action</th>
            </tr>
          </thead>
          <tbody className="financial-data text-sm">
            {isLoading ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading catalog...</td></tr>
            ) : fees.length > 0 ? (
              fees.map((fee) => (
                <tr key={fee.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-sans text-white font-bold">{fee.name}</td>
                  <td className="p-4 font-sans text-slate-300">
                    <span className="inline-flex items-center gap-2 bg-[#1A4D5C]/50 text-[#05CD99] px-2.5 py-1 rounded-full text-xs font-bold border border-[#05CD99]/20">
                      <Users size={12} /> {fee.target_cohort}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-sans">{fee.term}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold text-base">
                    {fee.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleIssueInvoices(fee)}
                      disabled={isPending && pendingId === fee.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/40 hover:text-white transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      {isPending && pendingId === fee.id ? (
                        <><Loader2 size={14} className="animate-spin" /> Processing</>
                      ) : (
                        <><Send size={14} /> Issue Invoices</>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 italic">No active levies found. Click "Define New Levy" to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateLevyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
