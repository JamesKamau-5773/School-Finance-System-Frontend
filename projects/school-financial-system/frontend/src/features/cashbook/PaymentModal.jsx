import React, { useState } from "react";
import { X, User, Receipt, CreditCard, Hash, Loader2 } from "lucide-react";
import { useSubmitPayment } from "./hooks/useCashbook";

export default function PaymentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    method: "MPESA",
    reference: "",
  });

  const {
    mutate: submitPayment,
    isPending,
    isError,
    error,
  } = useSubmitPayment();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPayment(formData, {
      onSuccess: () => {
        setFormData({
          studentId: "",
          amount: "",
          method: "MPESA",
          reference: "",
        });
        onClose();
      },
    });
  };

  return (
    /* Modal Backdrop - Dark and Blurred */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B14]/80 backdrop-blur-sm p-4">
      /* Glassmorphism Modal Container */
      <div className="w-full max-w-md bg-[#0B192C]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="text-[#FFC107]" size={20} />
            Record Payment
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Student Search / ID */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Student ID / Adm No
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                className="edtech-input pl-10"
                placeholder="e.g. ADM-2024-001"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Amount Received */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Amount Received (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-emerald-400 font-bold text-sm">KES</span>
              </div>
              <input
                type="number"
                className="edtech-input pl-12 financial-data text-emerald-400 text-lg font-bold"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Payment Method & Reference Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Method
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={16} className="text-slate-500" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-[#0B192C]"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option value="MPESA">M-PESA</option>
                  <option value="BANK">Bank Deposit</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Reference No.
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  className="edtech-input pl-10 uppercase"
                  placeholder="e.g. RC-0992"
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
          </div>

          {/* Modal Footer / Actions */}
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
              className="edtech-btn px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
          {isError && (
            <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded text-rose-300 text-sm">
              {error?.message || "Failed to submit payment"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
