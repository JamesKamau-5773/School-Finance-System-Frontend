import React, { useState } from "react";
import { X, Landmark, Hash, Calendar, Loader2 } from "lucide-react";
import { useReceiveCapitation } from "./hooks/useCashbook";

export default function CapitationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    amount: "",
    term: "Term 1",
    reference: "",
  });
  const {
    mutate: receiveCapitation,
    isPending,
    isError,
    error,
  } = useReceiveCapitation();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    receiveCapitation(formData, {
      onSuccess: () => {
        setFormData({ amount: "", term: "Term 1", reference: "" });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-text-border/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="text-alert-crimson" size={20} />
            MoE FDSE Capitation
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
              {error?.response?.data?.message || "Transaction Failed"}
            </div>
          )}

          {/* Warning/Info Banner */}
          <div className="p-3 bg-blue-500/15 border border-blue-400/40 rounded-lg text-blue-200 text-xs font-medium leading-relaxed">
            <strong>Note:</strong> Entering this block grant will trigger the
            automatic MoE statutory split (45% Tuition, 20% RMI, 10% Activity,
            etc.) across all internal ledger accounts instantly.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Total Block Amount (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-emerald-400 font-bold text-sm">KES</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="edtech-input pl-12 financial-data text-emerald-400 text-2xl font-bold"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Academic Term
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-slate-500" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border"
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({ ...formData, term: e.target.value })
                  }
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Central Bank Ref
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  className="edtech-input pl-10 uppercase"
                  placeholder="CBK-..."
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
              className="edtech-btn bg-action-mint hover:bg-action-mint/80 !text-structural-navy px-6 py-2 text-sm disabled:opacity-50 shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                "Distribute Capitation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
