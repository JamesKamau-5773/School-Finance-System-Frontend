import React, { useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  DollarSign,
  Tag,
  Sliders,
} from "lucide-react";
import DatePicker from "./components/DatePicker";

export default function CashbookFilter({
  filters,
  onFilterChange,
  onReset,
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (value) => {
    onFilterChange({
      ...filters,
      omnisearch: value,
    });
  };

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasValue = (value) => {
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return value > 0;
    return Boolean(value);
  };

  const hasActiveFilters = Object.values(filters).some(hasValue);

  const activeFilterList = [
    { key: "omnisearch", label: "Search", value: filters.omnisearch },
    { key: "date", label: "Date", value: filters.date },
    { key: "minAmount", label: "Min Amount", value: filters.minAmount > 0 ? `KES ${filters.minAmount}` : null },
    { key: "type", label: "Type", value: filters.type },
    { key: "category", label: "Category", value: filters.category },
    { key: "method", label: "Method", value: filters.method },
  ].filter((f) => hasValue(f.value));

  return (
    <div className="edtech-card p-6 mb-8">
      {/* Omni-Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-3.5 text-slate-300"
          />
          <input
            type="text"
            placeholder="Search transactions... (name, reference, invoice, student ID)"
            value={filters.omnisearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-structural-navy border border-text-border text-white pl-10 pr-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`px-4 py-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2 rounded-lg border transition-all ${
            isAdvancedOpen
              ? "bg-action-mint/10 text-action-mint border-action-mint/30"
              : "bg-structural-navy text-slate-300 border-text-border hover:bg-text-border/50"
          }`}
        >
          <Sliders size={14} />
          Advanced
          <ChevronDown
            size={14}
            className={`transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-4 py-3 text-sm font-bold text-slate-300 hover:text-rose-400 flex items-center gap-1 transition-colors border border-transparent hover:border-rose-500/30 rounded-lg"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterList.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-white/10">
          {activeFilterList.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-text-border/40 border border-text-border rounded-full text-xs font-bold text-white"
            >
              <span className="text-slate-300">{filter.label}:</span>
              <span className="text-action-mint">{filter.value}</span>
              <button
                onClick={() => {
                  if (filter.key === "minAmount") {
                    handleInputChange(filter.key, 0);
                  } else {
                    handleInputChange(filter.key, "");
                  }
                }}
                className="ml-1 text-slate-300 hover:text-rose-400 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Advanced Filters Drawer */}
      {isAdvancedOpen && (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-white/10">
          {/* Filter by Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Date
            </label>
            <DatePicker
              value={filters.date}
              onChange={(date) => handleInputChange("date", date)}
            />
          </div>

          {/* Filter by Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Min Amount (KES)
            </label>
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute left-3 top-3 text-slate-300"
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) =>
                  handleInputChange(
                    "minAmount",
                    parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0,
                  )
                }
                className="w-full bg-structural-navy border border-text-border text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full bg-structural-navy border border-text-border text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all appearance-none"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

          {/* Filter by Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Category
            </label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-3 text-slate-300" />
              <input
                type="text"
                placeholder="Category..."
                value={filters.category}
                onChange={(e) =>
                  handleInputChange("category", e.target.value)
                }
                className="w-full bg-structural-navy border border-text-border text-white pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter by Method */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Method
            </label>
            <input
              type="text"
              placeholder="Payment method..."
              value={filters.method}
              onChange={(e) => handleInputChange("method", e.target.value)}
              className="w-full bg-structural-navy border border-text-border text-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}

