import React, { useState } from "react";
import { X, ArrowRightLeft, FileText, Loader2 } from "lucide-react";
import { useReallocateFunds } from "./hooks/useCashbook";

export default function ReallocateModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    sourceVoteHead: "Activity",
    destinationVoteHead: "RMI",
    amount: "",
    reason: "",
  });
  const {
    mutate: reallocateFunds,
    isPending,
    isError,
    error,
  } = useReallocateFunds();

  if (!isOpen) return null;

  const VOTE_HEADS = [
    "Tuition",
    "RMI",
    "Activity",
    "Admin",
    "SMASSE",
    "Medical",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.sourceVoteHead === formData.destinationVoteHead) {
      alert("Source and Destination Vote Heads must be different.");
      return;
    }
    reallocateFunds(formData, {
      onSuccess: () => {
        setFormData({
          sourceVoteHead: "Activity",
          destinationVoteHead: "RMI",
          amount: "",
          reason: "",
        });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B14]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transform transition-all">
        {/* Header - Soft Amber Pastel */}
        <div className="px-6 py-4 border-b border-amber-100 flex justify-between items-center bg-amber-50">
          <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
            <ArrowRightLeft className="text-amber-600" size={20} />
            Reallocate Funds
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-amber-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-bold">
              {error?.response?.data?.message || "Reallocation Failed"}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                From (Debit)
              </label>
              <select
                className="edtech-input appearance-none !text-amber-700 font-bold border-amber-200 focus:!border-amber-500"
                value={formData.sourceVoteHead}
                onChange={(e) =>
                  setFormData({ ...formData, sourceVoteHead: e.target.value })
                }
              >
                {VOTE_HEADS.map((vh) => (
                  <option key={`src-${vh}`} value={vh}>
                    {vh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                To (Credit)
              </label>
              <select
                className="edtech-input appearance-none !text-emerald-700 font-bold border-emerald-200 focus:!border-emerald-500"
                value={formData.destinationVoteHead}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationVoteHead: e.target.value,
                  })
                }
              >
                {VOTE_HEADS.map((vh) => (
                  <option key={`dst-${vh}`} value={vh}>
                    {vh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Adjustment Amount (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-amber-600 font-bold text-sm">KES</span>
              </div>
              <input
                type="number"
                className="edtech-input pl-12 financial-data !text-amber-600 text-lg font-bold"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Reason for Override (Audit Log)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <FileText size={16} className="text-slate-400" />
              </div>
              <textarea
                className="edtech-input pl-10 min-h-[80px] resize-none"
                placeholder="e.g. Emergency roof repair authorized by BOM meeting."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              ></textarea>
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
              className="edtech-btn px-6 py-2 text-sm !bg-amber-500 !text-white !shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:!bg-amber-600"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                "Authorize Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
