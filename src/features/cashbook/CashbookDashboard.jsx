import React, { useMemo, useState } from "react";
import { Plus, ArrowDownRight, Activity, Landmark, ArrowRightLeft } from "lucide-react";
import PaymentModal from './PaymentModal';
import ExpenseModal from './ExpenseModal';
import CapitationModal from './CapitationModal';
import ReallocateModal from './ReallocateModal';
import { useTransactions, useSummary } from './hooks/useCashbook';
import VoteHeadDistribution from './VoteHeadDistribution';
import CashbookFilter from './CashbookFilter';


export default function CashbookDashboard() {
  const glassPanelClass =
    "rounded-3xl border border-app-background/45 bg-app-background/18 backdrop-blur-2xl shadow-xl shadow-structural-navy/45";

  const [filters, setFilters] = useState({
    omnisearch: "",
    date: "",
    minAmount: 0,
    type: "",
    category: "",
    method: "",
  });

  const { data: transactionData, isLoading: isLoadingTransactions } = useTransactions(filters);
  const { data: summary, isLoading: isLoadingSummary } = useSummary();

  const transactions = useMemo(() => {
    if (Array.isArray(transactionData)) {
      return transactionData;
    }

    if (Array.isArray(transactionData?.transactions)) {
      return transactionData.transactions;
    }

    if (Array.isArray(transactionData?.data)) {
      return transactionData.data;
    }

    return [];
  }, [transactionData]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCapitationModalOpen, setIsCapitationModalOpen] = useState(false);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = useState(false);

  // Since the backend now handles server-side filtering, 
  // we no longer need client-side filtering for the API-returned data
  const filteredTransactions = transactions;

  const handleResetFilters = () => {
    setFilters({
      omnisearch: "",
      date: "",
      minAmount: 0,
      type: "",
      category: "",
      method: "",
    });
  };

  if (isLoadingSummary) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="text-text-border/70">Loading financial summary...</div>
      </div>
    );
  }

  const totalIncome = summary?.total_income ?? summary?.total_collections ?? 0;
  const totalExpenses = summary?.total_expenses ?? 0;
  const netPosition = totalIncome - totalExpenses;

  // Calculate percentages for health bar
  const totalAmount = totalIncome + totalExpenses;
  const inflowPercent = totalAmount === 0 ? 0 : Math.round((totalIncome / totalAmount) * 100);
  const outflowPercent = totalAmount === 0 ? 0 : Math.round((totalExpenses / totalAmount) * 100);

  return (
    <div className="relative p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-structural-navy/90 via-structural-navy/60 to-action-mint/35" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,theme(colors.app-background/32),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,theme(colors.action-mint/45),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_70%,theme(colors.app-background/18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_95%_12%,theme(colors.app-background/35),transparent_16%)]" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-app-background/30 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-app-background mb-2 flex items-center gap-3">
            <Activity className="text-action-mint" size={32} />
            Digital Cashbook
          </h1>
          <p className="text-app-background/75 font-bold tracking-wide uppercase text-sm">
            Daily Income & Expense Ledger
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-full border border-app-background/60 bg-app-background/22 px-7 py-3 font-semibold text-app-background backdrop-blur-xl transition hover:bg-app-background/30"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            <ArrowDownRight size={18} />
            Record Expense
          </button>
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-full border border-action-mint/70 bg-action-mint/95 px-7 py-3 font-bold text-structural-navy shadow-xl shadow-action-mint/45 transition hover:bg-action-mint hover:shadow-2xl hover:shadow-action-mint/55"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            <Plus size={18} />
            Receive Payment
          </button>
        </div>
      </div>

      {/* MoE Action Bar */}
      <div className="flex flex-wrap items-center justify-start gap-4 mb-10">
        <button
          onClick={() => setIsCapitationModalOpen(true)}
          className="edtech-btn-secondary text-sm px-4 py-2 flex items-center justify-center gap-2"
        >
          <Landmark size={16} />
          Log MoE Capitation
        </button>
        <button
          onClick={() => setIsReallocateModalOpen(true)}
          className="edtech-btn-secondary text-sm px-4 py-2 flex items-center justify-center gap-2"
        >
          <ArrowRightLeft size={16} />
          Reallocate Vote Heads
        </button>
      </div>

      {/* Visual Health Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-xs font-bold mb-2 tracking-wider">
          <span className="text-action-mint">INFLOW ({inflowPercent}%)</span>
          <span className="text-alert-crimson">OUTFLOW ({outflowPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-app-background/22 rounded-full flex overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-action-mint" style={{ width: `${inflowPercent}%` }}></div>
          <div className="h-full bg-alert-crimson" style={{ width: `${outflowPercent}%` }}></div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className={`relative overflow-hidden group p-6 ${glassPanelClass}`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-action-mint opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-app-background/85 text-xs font-bold uppercase tracking-widest mb-3">Total Collections</h3>
          <p className="text-4xl financial-data text-app-background">
            {summary?.total_collections?.toLocaleString('en-KE', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
        <div className={`relative overflow-hidden group p-6 ${glassPanelClass}`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-alert-crimson opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-app-background/85 text-xs font-bold uppercase tracking-widest mb-3">Total Expenses</h3>
          <p className="text-4xl financial-data text-app-background">
            {summary?.total_expenses?.toLocaleString('en-KE', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
        <div className={`relative overflow-hidden p-6 ${glassPanelClass}`}>
          <h3 className="text-app-background text-xs font-bold uppercase tracking-widest mb-3">Net Position</h3>
          <p className="text-4xl financial-data text-app-background">
            {summary?.net_position?.toLocaleString('en-KE', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
      </div>

      <VoteHeadDistribution />

      <div className="relative z-20">
        <CashbookFilter
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Ledger Table */}
      <div className={`${glassPanelClass} p-0`}>
        <div className="p-6 border-b border-app-background/35 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-app-background text-lg">Recent Transactions</h3>
          <span className="text-xs whitespace-nowrap font-bold px-3 py-1 bg-app-background/28 text-app-background tracking-wider rounded-lg border border-app-background/50">
            SYNCED: JUST NOW
          </span>
        </div>
        <div className="overflow-x-auto" aria-busy={isLoadingTransactions}>
          <table
            className="w-full text-left text-sm"
            style={{ borderCollapse: "collapse", minWidth: "760px" }}
          >
            <thead>
              <tr className="border-b border-app-background/35">
                <th className="p-4 text-xs font-bold text-app-background/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-xs font-bold text-app-background/70 uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-xs font-bold text-app-background/70 uppercase tracking-wider">
                  Ref
                </th>
                <th className="p-4 text-xs font-bold text-app-background/70 uppercase tracking-wider text-center">
                  Type
                </th>
                <th className="p-4 text-xs font-bold text-app-background/70 uppercase tracking-wider text-right">
                  Amount (KES)
                </th>
              </tr>
            </thead>
            <tbody className="financial-data">
              {isLoadingTransactions ? (
                <tr>
                  <td className="p-6 text-center text-app-background/60 font-medium" colSpan={4}>
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-app-background/25 last:border-b-0 hover:bg-app-background/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-app-background">{tx.date}</div>
                    </td>
                    <td className="p-4 font-sans text-app-background/85 font-medium">
                      <div>{tx.description}</div>
                    </td>
                    <td className="p-4 font-mono text-xs text-app-background/65">
                      {tx.reference_no || '-'}
                    </td>
                    <td className="p-4 text-center">
                      {tx.type.toUpperCase() === "INCOME" ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-action-mint/15 text-action-mint font-sans text-xs font-bold rounded-full">
                          INCOME
                        </span>
                      ) : tx.type.toUpperCase() === "EXPENSE" ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-alert-crimson/10 text-alert-crimson font-sans text-xs font-bold rounded-full">
                          EXPENSE
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-app-background/18 text-app-background font-sans text-xs font-bold rounded-full border border-app-background/35">
                          ADJUSTMENT
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-action-mint' : 'text-alert-crimson'}`}
                    >
                      {tx.amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-app-background/60 font-medium"
                  >
                    No transactions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
      />
      <CapitationModal
        isOpen={isCapitationModalOpen}
        onClose={() => setIsCapitationModalOpen(false)}
      />
      <ReallocateModal
        isOpen={isReallocateModalOpen}
        onClose={() => setIsReallocateModalOpen(false)}
      />
    </div>
  );
}
