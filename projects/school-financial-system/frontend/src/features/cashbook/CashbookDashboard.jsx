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
  const [filters, setFilters] = useState({
    description: "",
    date: "",
    referenceNo: "",
    minAmount: 0,
    type: "",
    category: "",
    method: "",
    invoiceNo: "",
    studentId: "",
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  const { data: summary, isLoading: isLoadingSummary } = useSummary();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCapitationModalOpen, setIsCapitationModalOpen] = useState(false);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    const normalizedDescription = filters.description.trim().toLowerCase();
    const normalizedRefNo = filters.referenceNo.trim().toLowerCase();
    const normalizedCategory = filters.category.trim().toLowerCase();
    const normalizedMethod = filters.method.trim().toLowerCase();
    const normalizedInvoiceNo = filters.invoiceNo.trim().toLowerCase();
    const normalizedStudentId = filters.studentId.trim().toLowerCase();
    const minAmount = filters.minAmount || 0;

    return transactions.filter((tx) => {
      if (
        normalizedDescription &&
        !String(tx.description || "").toLowerCase().includes(normalizedDescription)
      ) {
        return false;
      }

      if (
        normalizedRefNo &&
        !String(tx.reference_no || "").toLowerCase().includes(normalizedRefNo)
      ) {
        return false;
      }

      if (
        normalizedCategory &&
        !String(tx.category || "").toLowerCase().includes(normalizedCategory)
      ) {
        return false;
      }

      if (
        normalizedMethod &&
        !String(tx.payment_method || "").toLowerCase().includes(normalizedMethod)
      ) {
        return false;
      }

      if (
        normalizedInvoiceNo &&
        !String(tx.invoice_no || "").toLowerCase().includes(normalizedInvoiceNo)
      ) {
        return false;
      }

      if (
        normalizedStudentId &&
        !String(tx.student_id || "").toLowerCase().includes(normalizedStudentId)
      ) {
        return false;
      }

      if (filters.date && tx.date !== filters.date) {
        return false;
      }

      if (minAmount > 0 && Number(tx.amount || 0) < minAmount) {
        return false;
      }

      if (filters.type && tx.type !== filters.type) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const handleResetFilters = () => {
    setFilters({
      description: "",
      date: "",
      referenceNo: "",
      minAmount: 0,
      type: "",
      category: "",
      method: "",
      invoiceNo: "",
      studentId: "",
    });
  };

  if (isLoadingSummary) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="text-white/50">Loading financial summary...</div>
      </div>
    );
  }

  const totalIncome = summary?.total_income ?? 0;
  const totalExpenses = summary?.total_expenses ?? 0;
  const netPosition = totalIncome - totalExpenses;

  // Calculate percentages for health bar
  const totalAmount = totalIncome + totalExpenses;
  const inflowPercent = totalAmount === 0 ? 0 : Math.round((totalIncome / totalAmount) * 100);
  const outflowPercent = totalAmount === 0 ? 0 : Math.round((totalExpenses / totalAmount) * 100);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <Activity className="text-[#FFC107]" size={32} />
            Digital Cashbook
          </h1>
          <p className="text-white/60 font-bold tracking-wide uppercase text-sm">
            Daily Income & Expense Ledger
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            className="edtech-btn-secondary"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            <ArrowDownRight size={18} />
            Record Expense
          </button>
          <button 
            className="edtech-btn"
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
          <span className="text-emerald-400">INFLOW ({inflowPercent}%)</span>
          <span className="text-rose-400">OUTFLOW ({outflowPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full flex overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${inflowPercent}%` }}></div>
          <div className="h-full bg-rose-500" style={{ width: `${outflowPercent}%` }}></div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="edtech-card relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Total Collections</h3>
          <p className="text-4xl financial-data text-white">
            {summary.total_collections.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="edtech-card relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Total Expenses</h3>
          <p className="text-4xl financial-data text-white">
            {summary.total_expenses.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="edtech-card relative overflow-hidden border-[#FFC107]/30 bg-[#1A4D5C]/40">
          <h3 className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-3">Net Position</h3>
          <p className="text-4xl financial-data text-white">
            {summary.net_position.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <VoteHeadDistribution />

      <CashbookFilter
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Ledger Table */}
      <div className="edtech-card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-white text-lg">Recent Transactions</h3>
          <span className="text-xs whitespace-nowrap font-bold px-3 py-1 bg-white/5 text-white/60 tracking-wider rounded-lg border border-white/10">
            SYNCED: JUST NOW
          </span>
        </div>
        <div className="overflow-x-auto" aria-busy={isLoadingTransactions}>
          <table
            className="w-full text-left text-sm"
            style={{ borderCollapse: "collapse", minWidth: "600px" }}
          >
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">
                  Date/Ref
                </th>
                <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider text-center">
                  Type
                </th>
                <th className="p-4 text-xs font-bold text-white/60 uppercase tracking-wider text-right">
                  Amount (KES)
                </th>
              </tr>
            </thead>
            <tbody className="financial-data">
              {isLoadingTransactions ? (
                <tr>
                  <td className="p-6 text-center text-white/50 font-medium" colSpan={4}>
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-white">{tx.date}</div>
                      <div className="text-xs text-white/50 mt-1">{tx.reference_no}</div>
                    </td>
                    <td className="p-4 font-sans text-white/80 font-medium">
                      {tx.description}
                    </td>
                    <td className="p-4 text-center">
                      {tx.type === "INCOME" ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-sans text-xs font-bold rounded-full">
                          INCOME
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-rose-500/10 text-rose-400 font-sans text-xs font-bold rounded-full">
                          EXPENSE
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      {tx.amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-white/50 font-medium"
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
