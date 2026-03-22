import React from "react";
import {
  Search,
  X,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Tag,
} from "lucide-react";

export default function CashbookFilter({
  filters,
  onFilterChange,
  onReset,
}) {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some((val) => {
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "number") return val > 0;
    return false;
  });

  return (
    <div className="edtech-card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Filter size={18} className="text-[#05CD99]" />
          Filter & Search Transactions
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {/* Search Description */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Description
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-3 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search description..."
              value={filters.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter by Date */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Date
          </label>
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-3 text-slate-500"
            />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter by Reference Number */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Reference No
          </label>
          <div className="relative">
            <FileText
              size={14}
              className="absolute left-3 top-3 text-slate-500"
            />
            <input
              type="text"
              placeholder="Ref number..."
              value={filters.referenceNo}
              onChange={(e) =>
                handleInputChange("referenceNo", e.target.value)
              }
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter by Amount */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Min Amount (KES)
          </label>
          <div className="relative">
            <DollarSign
              size={14}
              className="absolute left-3 top-3 text-slate-500"
            />
            <input
              type="number"
              placeholder="0"
              value={filters.minAmount}
              onChange={(e) =>
                handleInputChange("minAmount", parseFloat(e.target.value) || 0)
              }
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter by Type (Income/Expense) */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all appearance-none"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        {/* Filter by Category */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Category
          </label>
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Category..."
              value={filters.category}
              onChange={(e) =>
                handleInputChange("category", e.target.value)
              }
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter by Method */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Method
          </label>
          <input
            type="text"
            placeholder="Payment method..."
            value={filters.method}
            onChange={(e) => handleInputChange("method", e.target.value)}
            className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
          />
        </div>

        {/* Filter by Invoice No */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Invoice No
          </label>
          <input
            type="text"
            placeholder="Invoice number..."
            value={filters.invoiceNo}
            onChange={(e) =>
                handleInputChange("invoiceNo", e.target.value)
              }
            className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
          />
        </div>

        {/* Filter by Student ID/ADM */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Student ID / ADM No
          </label>
          <input
            type="text"
            placeholder="Student ID or ADM..."
            value={filters.studentId}
            onChange={(e) =>
                handleInputChange("studentId", e.target.value)
              }
            className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}
