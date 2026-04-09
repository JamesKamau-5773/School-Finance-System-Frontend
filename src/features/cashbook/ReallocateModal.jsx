import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, FileText, Loader2 } from "lucide-react";
import { useReallocateFunds, useVoteHeads } from "./hooks/useCashbook";

export default function ReallocateModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    sourceVoteHead: "",
    destinationVoteHead: "",
    amount: "",
    reason: "",
  });
  const { data: voteHeadsData = [], isLoading: isLoadingVoteHeads } = useVoteHeads();
  const {
    mutate: reallocateFunds,
    isPending,
    isError,
    error,
  } = useReallocateFunds();

  const voteHeads = Array.isArray(voteHeadsData) ? voteHeadsData : voteHeadsData?.data || [];

  // Initialize form data when vote heads are loaded
  useEffect(() => {
    if (voteHeads.length > 0 && !formData.sourceVoteHead) {
      setFormData({
        sourceVoteHead: voteHeads[0].name || voteHeads[0].id,
        destinationVoteHead: voteHeads[1]?.name || voteHeads[1]?.id || voteHeads[0].name || voteHeads[0].id,
        amount: "",
        reason: "",
      });
    }
  }, [voteHeads]);

  if (!isOpen || !voteHeads.length) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-text-border/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="text-alert-crimson" size={20} />
            Reallocate Funds
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
              {error?.response?.data?.message || "Reallocation Failed"}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                From (Debit)
              </label>
              <select
                className="edtech-input appearance-none bg-text-border"
                value={formData.sourceVoteHead}
                onChange={(e) =>
                  setFormData({ ...formData, sourceVoteHead: e.target.value })
                }
              >
                {voteHeads.map((vh) => (
                  <option key={`src-${vh.id}`} value={vh.name}>
                    {vh.name} ({vh.percentage}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                To (Credit)
              </label>
              <select
                className="edtech-input appearance-none bg-text-border"
                value={formData.destinationVoteHead}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationVoteHead: e.target.value,
                  })
                }
              >
                {voteHeads.map((vh) => (
                  <option key={`dst-${vh.id}`} value={vh.name}>
                    {vh.name} ({vh.percentage}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Adjustment Amount (KES)
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

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Reason for Override (Audit Log)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <FileText size={16} className="text-slate-500" />
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
                "Authorize Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
