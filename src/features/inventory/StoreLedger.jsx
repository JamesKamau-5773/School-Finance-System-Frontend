import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
} from "lucide-react";
import { financeApi } from "../../api/financeApi";

export default function StoreLedger() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    action: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
  });

  // useQuery with filter states in query key for automatic backend refetch
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["inventory_transactions", filters, pagination],
    queryFn: async () => {
      try {
        // Build query filters for backend
        const apiFilters = {
          category: filters.category,
          action: filters.action,
          startDate: filters.startDate,
          endDate: filters.endDate,
          limit: pagination.limit,
          offset: pagination.offset,
        };

        const result = await financeApi.getInventoryTransactions(apiFilters);

        // Ensure result is structured correctly
        const transactionsArray = Array.isArray(result)
          ? result
          : result?.data || [];

        return {
          transactions: transactionsArray,
          count: result?.count || transactionsArray.length,
        };
      } catch (err) {
        console.error("Failed to fetch inventory transactions:", err);
        throw err;
      }
    },
    staleTime: 30000, // 30 seconds
  });

  // Ensure transactions is always an array
  const transactions = response?.transactions || [];
  const totalCount = response?.count || 0;

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
    setPagination({ limit: 50, offset: 0 }); // Reset pagination on filter change
  };

  const handleActionChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      action: e.target.value,
    }));
    setPagination({ limit: 50, offset: 0 });
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      category: e.target.value,
    }));
    setPagination({ limit: 50, offset: 0 });
  };

  const handleStartDateChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
    setPagination({ limit: 50, offset: 0 });
  };

  const handleEndDateChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
    setPagination({ limit: 50, offset: 0 });
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      action: "",
      category: "",
      startDate: "",
      endDate: "",
    });
    setPagination({ limit: 50, offset: 0 });
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  // Format ISO date for display
  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action) => {
    return action === "issued" ? (
      <ArrowUpFromLine size={14} className="text-rose-400" />
    ) : (
      <ArrowDownToLine size={14} className="text-action-mint" />
    );
  };

  // Extract recipient/supplier info based on action type
  const getPartyInfo = (txn) => {
    if (txn.action === "issued") {
      // Extract "Issued to: X" from remarks
      if (txn.remarks && txn.remarks.includes("Issued to:")) {
        const match = txn.remarks.match(/Issued to:\s*([^.]+)/);
        return match ? match[1].trim() : "-";
      }
      return "-";
    } else {
      // For received, show supplier name
      return txn.supplier || "-";
    }
  };

  // Get reference/tracking info
  const getReferenceInfo = (txn) => {
    if (txn.action === "issued") {
      return "-"; // No reference for issued
    } else {
      // For received, show reference number
      return txn.reference_no || "-";
    }
  };

  // Get recorded by - try multiple field names
  const getRecordedBy = (txn) => {
    return (
      txn.recorded_by_username ||
      txn.created_by_username ||
      txn.user_name ||
      txn.recorded_by ||
      "-"
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ClipboardList className="text-action-mint" size={28} />
            Store Ledger
          </h1>
          <p className="text-slate-300 font-medium tracking-wide uppercase text-sm mt-1">
            Append-only transaction audit trail
          </p>
        </div>
      </div>

      {/* Summary Card */}
      {!isLoading && !error && (
        <div className="bg-text-border border border-text-border shadow-lg rounded-xl mb-8 p-4">
          <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">
            Total Transactions
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">
            {totalCount}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl mb-8 p-4 sm:p-6 space-y-4">
        {/* Row 1: Search + Action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-action-mint" />
            </div>
            <input
              type="text"
              placeholder="Search by item name..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-structural-navy border border-text-border text-white pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
            />
          </div>

          <select
            value={filters.action}
            onChange={handleActionChange}
            className="w-full sm:w-40 px-4 py-3 bg-structural-navy text-slate-300 border border-text-border hover:bg-text-border/50 hover:text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-all appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "40px",
            }}
          >
            <option value="">All Actions</option>
            <option value="received">Received (IN)</option>
            <option value="issued">Issued (OUT)</option>
          </select>
        </div>

        {/* Row 2: Category + Date Range */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full sm:flex-1 px-4 py-3 bg-structural-navy text-slate-300 border border-text-border hover:bg-text-border/50 hover:text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-all appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "40px",
            }}
          >
            <option value="">All Categories</option>
            <option value="Stationery">Stationery</option>
            <option value="Consumables">Consumables</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={handleStartDateChange}
            className="date-input-visible w-full sm:w-40 px-4 py-3 bg-structural-navy border border-text-border text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={handleEndDateChange}
            className="date-input-visible w-full sm:w-40 px-4 py-3 bg-structural-navy border border-text-border text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
            placeholder="To Date"
          />

          <button
            onClick={handleClearFilters}
            className="px-4 py-3 bg-alert-crimson/20 text-alert-crimson border border-alert-crimson/50 hover:bg-alert-crimson/30 text-sm font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-action-mint border-t-transparent"></div>
            <p className="text-slate-400">Loading transactions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-rose-400">
              Failed to load transactions
            </h3>
            <p className="text-rose-400/80 text-sm mt-1">
              {error?.message || "Please try again later"}
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {!isLoading && !error && (
        <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 p-0 overflow-hidden rounded-xl mb-8">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-left"
                style={{
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr className="border-b border-text-border bg-structural-navy/50">
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Date & Time
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Item Name
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-center">
                      Action
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">
                      Quantity
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Supplier / Issued To
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Ref No
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Recorded By
                    </th>
                  </tr>
                </thead>
                <tbody className="financial-data text-sm">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-mono text-slate-300">
                        {formatDateTime(txn.created_at)}
                      </td>
                      <td className="p-4 font-sans text-white font-bold">
                        {txn.item_name}
                      </td>
                      <td className="p-4">
                        <span className="bg-white/5 px-2.5 py-1 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 rounded-md">
                          {txn.category || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md">
                          {getActionIcon(txn.action)}
                          <span
                            className={`text-xs font-bold uppercase ${
                              txn.action === "issued"
                                ? "text-rose-400"
                                : "text-action-mint"
                            }`}
                          >
                            {txn.action === "issued" ? "Issued" : "Received"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`font-mono font-bold text-lg tracking-wider ${
                            txn.action === "issued"
                              ? "text-rose-400"
                              : "text-action-mint"
                          }`}
                        >
                          {txn.quantity.toLocaleString("en-KE")}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 font-sans">
                        {getPartyInfo(txn)}
                      </td>
                      <td className="p-4 text-slate-300 font-mono">
                        {getReferenceInfo(txn)}
                      </td>
                      <td className="p-4 text-slate-300">
                        {getRecordedBy(txn)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && transactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            Showing {pagination.offset + 1} to{" "}
            {Math.min(pagination.offset + pagination.limit, totalCount)} of{" "}
            {totalCount} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pagination.offset === 0}
              className="px-4 py-2 bg-structural-navy border border-text-border text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-text-border/50 hover:text-white text-sm font-bold uppercase rounded-lg transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagination.offset + pagination.limit >= totalCount}
              className="px-4 py-2 bg-structural-navy border border-text-border text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-text-border/50 hover:text-white text-sm font-bold uppercase rounded-lg transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
