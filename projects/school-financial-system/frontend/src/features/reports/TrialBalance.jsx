import React, { useEffect, useMemo, useState } from "react";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Printer,
  List,
  Search,
} from "lucide-react";
import {
  useTrialBalance,
  useAccountLedger,
} from "../cashbook/hooks/useCashbook";

const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return numericAmount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
  });
};

const formatAccountName = (accountName) => {
  return (accountName || "").replace(/_/g, " ");
};

const formatDateOnly = (dateValue) => {
  return typeof dateValue === "string" ? dateValue.split(" ")[0] : "-";
};

const isPositiveAmount = (amount) => {
  return Number(amount) > 0;
};

export default function TrialBalance() {
  // State for UI control
  const [activeTab, setActiveTab] = useState("trial_balance"); // 'trial_balance' | 'general_ledger'
  const [selectedAccount, setSelectedAccount] = useState("");

  // Data Hooks
  const {
    data: tbData,
    isLoading: tbLoading,
    isError: tbError,
    error: tbQueryError,
  } = useTrialBalance();
  const { data: ledgerData, isLoading: ledgerLoading } =
    useAccountLedger(selectedAccount);

  const lines = useMemo(() => tbData?.lines || [], [tbData]);
  const totals = useMemo(
    () =>
      tbData?.totals || {
        debit: 0,
        credit: 0,
        is_balanced: false,
      },
    [tbData],
  );

  useEffect(() => {
    if (activeTab === "general_ledger" && !selectedAccount && lines.length > 0) {
      setSelectedAccount(lines[0].account);
    }
  }, [activeTab, selectedAccount, lines]);

  if (tbLoading)
    return (
      <div className="p-8 text-slate-400 font-medium">
        Loading Audit Reports...
      </div>
    );

  if (tbError) {
    const status = tbQueryError?.response?.status;
    const message =
      tbQueryError?.response?.data?.error ||
      tbQueryError?.message ||
      "Unable to fetch trial balance.";

    return (
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="edtech-card border border-rose-500/40 bg-rose-500/10 p-6">
          <h2 className="text-lg font-bold text-rose-300 mb-2">
            Failed to load Audit Report{status ? ` (HTTP ${status})` : ""}
          </h2>
          <p className="text-rose-200/90 text-sm">{message}</p>
        </div>
      </div>
    );
  }

  if (!tbData) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Report Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Scale className="text-[#FFC107]" size={28} />
            Audit Reports
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            Trial Balance & General Ledger Inquiry
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="edtech-btn-secondary px-4 py-2 flex items-center gap-2 text-sm"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>

      {/* Glass Tab Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-black/20 border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("trial_balance")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "trial_balance"
              ? "bg-[#1A4D5C] text-white shadow-lg border border-[#05CD99]/30"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Scale size={16} /> Trial Balance
        </button>
        <button
          onClick={() => setActiveTab("general_ledger")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "general_ledger"
              ? "bg-[#1A4D5C] text-white shadow-lg border border-[#05CD99]/30"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <List size={16} /> General Ledger
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: THE TRIAL BALANCE                  */}
      {/* ========================================= */}
      {activeTab === "trial_balance" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
              totals.is_balanced
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {totals.is_balanced ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
            <span className="font-bold text-sm tracking-wide">
              {totals.is_balanced
                ? "SYSTEM BALANCED: Total Debits exactly match Total Credits."
                : "AUDIT WARNING: Ledger out of balance. Check transaction logs immediately."}
            </span>
          </div>

          <div className="edtech-card p-0 overflow-hidden">
            <table
              className="w-full text-left"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Account Ledger
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Debit (KES)
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                    Credit (KES)
                  </th>
                </tr>
              </thead>
              <tbody className="financial-data text-sm">
                {lines.map((line, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-sans text-slate-200 font-medium">
                      {formatAccountName(line.account)}
                    </td>
                    <td className="p-4 text-right text-slate-300">
                      {isPositiveAmount(line.debit)
                        ? formatCurrency(line.debit)
                        : "-"}
                    </td>
                    <td className="p-4 text-right text-slate-300">
                      {isPositiveAmount(line.credit)
                        ? formatCurrency(line.credit)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-black/40 text-white financial-data text-base font-bold">
                  <td className="p-4 text-right font-sans uppercase tracking-widest text-xs text-slate-400">
                    Grand Total
                  </td>
                  <td
                    className={`p-4 text-right border-t-2 ${totals.is_balanced ? "border-emerald-500 text-emerald-400" : "border-rose-500 text-rose-400"}`}
                  >
                    {formatCurrency(totals.debit)}
                  </td>
                  <td
                    className={`p-4 text-right border-t-2 ${totals.is_balanced ? "border-emerald-500 text-emerald-400" : "border-rose-500 text-rose-400"}`}
                  >
                    {formatCurrency(totals.credit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: THE GENERAL LEDGER                 */}
      {/* ========================================= */}
      {activeTab === "general_ledger" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Account Selector */}
          <div className="mb-6 flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/10 w-full max-w-md">
            <Search className="text-slate-400" size={20} />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Account to Inspect
              </label>
              <select
                className="edtech-input !py-2 !bg-transparent !border-white/20 !text-[#05CD99] font-bold"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                {/* We use the active accounts from the Trial Balance to populate this list */}
                {lines.map((line, idx) => (
                  <option
                    key={idx}
                    value={line.account}
                    className="bg-[#050B14] text-white"
                  >
                    {formatAccountName(line.account)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ledger History Table */}
          <div className="edtech-card p-0 overflow-hidden">
            <div className="p-5 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">
                {formatAccountName(selectedAccount)} History
              </h3>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 tracking-wider rounded-full border border-indigo-500/30">
                AUDIT TRAIL
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                className="w-full text-left"
                style={{ borderCollapse: "collapse", minWidth: "900px" }}
              >
                <thead>
                  <tr className="border-b border-white/10 bg-black/40">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Date / Ref
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Debit (In)
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Credit (Out)
                    </th>
                    <th className="p-4 text-xs font-bold text-[#FFC107] uppercase tracking-wider text-right bg-white/5">
                      Running Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="financial-data text-sm">
                  {ledgerLoading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-slate-400"
                      >
                        Loading ledger records...
                      </td>
                    </tr>
                  ) : ledgerData && ledgerData.length > 0 ? (
                    ledgerData.map((tx, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-slate-200">
                            {formatDateOnly(tx.date)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {tx.reference_no}
                          </div>
                        </td>
                        <td
                          className="p-4 font-sans text-slate-300 max-w-xs truncate"
                          title={tx.description}
                        >
                          {tx.description}
                        </td>
                        <td className="p-4 text-right text-emerald-400">
                          {isPositiveAmount(tx.debit)
                            ? formatCurrency(tx.debit)
                            : "-"}
                        </td>
                        <td className="p-4 text-right text-rose-400">
                          {isPositiveAmount(tx.credit)
                            ? formatCurrency(tx.credit)
                            : "-"}
                        </td>
                        <td className="p-4 text-right text-[#FFC107] font-bold bg-white/5">
                          {formatCurrency(tx.running_balance)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-slate-500 italic"
                      >
                        No transactions found for this account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
