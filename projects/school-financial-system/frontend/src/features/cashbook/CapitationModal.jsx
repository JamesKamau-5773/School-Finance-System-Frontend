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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B14]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transform transition-all">
        {/* Header - Soft Indigo Pastel */}
        <div className="px-6 py-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Landmark className="text-indigo-600" size={20} />
            MoE FDSE Capitation
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-indigo-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-bold">
              {error?.response?.data?.message || "Transaction Failed"}
            </div>
          )}

          {/* Warning/Info Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-medium leading-relaxed">
            <strong>Note:</strong> Entering this block grant will trigger the
            automatic MoE statutory split (45% Tuition, 20% RMI, 10% Activity,
            etc.) across all internal ledger accounts instantly.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Total Block Amount (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-indigo-600 font-bold text-sm">KES</span>
              </div>
              <input
                type="number"
                className="edtech-input pl-12 financial-data !text-indigo-700 text-2xl font-bold"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Academic Term
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-slate-400" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none"
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Central Bank Ref
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-slate-400" />
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

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-full text-sm font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="edtech-btn px-6 py-2 text-sm !bg-indigo-600 !text-white !shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:!bg-indigo-700 hover:!shadow-[0_6px_20px_rgba(79,70,229,0.5)]"
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
