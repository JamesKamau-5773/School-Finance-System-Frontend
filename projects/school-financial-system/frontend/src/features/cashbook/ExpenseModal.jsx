import React, { useState } from "react";
import {
  X,
  ArrowDownRight,
  Tag,
  CreditCard,
  Hash,
  FileText,
  Loader2,
} from "lucide-react";
import { useSubmitExpense } from "./hooks/useCashbook";

export default function ExpenseModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "SUPPLIES",
    customCategory: "",
    method: "BANK",
    reference: "",
  });

  const {
    mutate: submitExpense,
    isPending,
    isError,
    error,
  } = useSubmitExpense();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category:
        formData.category === "OTHER"
          ? formData.customCategory.trim()
          : formData.category,
    };

    submitExpense(payload, {
      onSuccess: () => {
        setFormData({
          description: "",
          amount: "",
          category: "SUPPLIES",
          customCategory: "",
          method: "BANK",
          reference: "",
        });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-text-border/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header - Rose Accented */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowDownRight className="text-alert-crimson" size={20} />
            Record Expense
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm font-bold">
              Transaction Failed:{" "}
              {error?.response?.data?.message || "Check server connection"}
            </div>
          )}

          {/* Description (Who/What are we paying?) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Description / Payee
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                className="edtech-input pl-10"
                placeholder="e.g. Kaptembwa Timbers - Firewood"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Receipt / Invoice No.
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                className="edtech-input pl-10 uppercase"
                placeholder="e.g. ETIMS-99201"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reference: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
          </div>

          {/* Amount (Outflow) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Amount Paid (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-emerald-400 font-bold text-sm">KES</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="edtech-input pl-12 financial-data text-emerald-400 text-lg font-bold"
                placeholder="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
                required
              />
            </div>
          </div>

          {/* Category & Method Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Category (Vote)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={16} className="text-slate-500" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      customCategory:
                        e.target.value === "OTHER" ? formData.customCategory : "",
                    })
                  }
                >
                  <option value="SUPPLIES">Supplies (Food/Wood)</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="SALARY">B.O.M Salaries</option>
                  <option value="UTILITIES">Utilities (Water/Elec)</option>
                  <option value="OTHER">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Method
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={16} className="text-slate-500" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option value="BANK">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="PETTY_CASH">Petty Cash</option>
                </select>
              </div>
            </div>
          </div>

          {formData.category === "OTHER" && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Specify Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  className="edtech-input pl-10"
                  placeholder="e.g. Transport"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Footer Actions - Note the styling overrides to match the red destructive action */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="edtech-btn-secondary px-4 py-2 rounded-full text-sm font-bold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
                className="edtech-btn bg-action-mint hover:bg-action-mint/80 !text-structural-navy px-6 py-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                "Confirm Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
