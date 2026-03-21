import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { useTrialBalance } from '../cashbook/hooks/useCashbook';

const formatCurrency = (amount) => {
  return amount.toLocaleString('en-KE', { minimumFractionDigits: 2 });
};

const formatAccountName = (account) => {
  return account.replace(/_/g, ' ');
};

const getBalanceStatus = (isBalanced) => {
  if (isBalanced) {
    return {
      containerClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      message: 'SYSTEM BALANCED: Total Debits exactly match Total Credits.',
      Icon: CheckCircle2,
    };
  }

  return {
    containerClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    message: 'AUDIT WARNING: Ledger out of balance. Check transaction logs immediately.',
    Icon: AlertTriangle,
  };
};

export default function TrialBalance() {
  const { data: tbData, isLoading } = useTrialBalance();

  if (isLoading) return <div className="p-8 text-slate-400 font-medium">Loading Trial Balance...</div>;
  if (!tbData) return null;

  const { lines, totals } = tbData;
  const balanceStatus = getBalanceStatus(totals.is_balanced);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      {/* Report Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Scale className="text-[#FFC107]" size={28} />
            Trial Balance
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Real-time Double-Entry Verification</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="edtech-btn-secondary px-4 py-2 flex items-center gap-2 text-sm"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>

      {/* System Status Banner */}
      <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${balanceStatus.containerClass}`}>
        <balanceStatus.Icon size={20} />
        <span className="font-bold text-sm tracking-wide">
          {balanceStatus.message}
        </span>
      </div>

      {/* The Formal Report Table */}
      <div className="edtech-card p-0 overflow-hidden">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account Ledger</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Debit (KES)</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Credit (KES)</th>
            </tr>
          </thead>
          <tbody className="financial-data text-sm">
            {lines.map((line, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-sans text-slate-200 font-medium">{formatAccountName(line.account)}</td>
                <td className="p-4 text-right text-slate-300">
                  {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                </td>
                <td className="p-4 text-right text-slate-300">
                  {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Grand Totals Footer */}
          <tfoot>
            <tr className="bg-black/40 text-white financial-data text-base font-bold">
              <td className="p-4 text-right font-sans uppercase tracking-widest text-xs text-slate-400">Grand Total</td>
              <td className={`p-4 text-right border-t-2 ${totals.is_balanced ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}>
                {formatCurrency(totals.debit)}
              </td>
              <td className={`p-4 text-right border-t-2 ${totals.is_balanced ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}>
                {formatCurrency(totals.credit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
