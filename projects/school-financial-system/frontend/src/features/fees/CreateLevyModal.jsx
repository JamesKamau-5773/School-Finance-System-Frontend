import React, { useState } from "react";
import { X, WalletCards, Users, Calendar, Loader2 } from "lucide-react";
import { useCreateFeeStructure } from "./hooks/useFees";

export default function CreateLevyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    academic_year: "2026",
    term: "Term 1",
    target_cohort: "All Students",
  });

  const {
    mutate: createLevy,
    isPending,
    isError,
    error,
  } = useCreateFeeStructure();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createLevy(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          amount: "",
          academic_year: "2026",
          term: "Term 1",
          target_cohort: "All Students",
        });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md edtech-card border border-white/10 !bg-text-border/90 p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <WalletCards className="text-alert-crimson" size={20} />
            Define New Levy
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm font-bold">
              {error?.response?.data?.message || "Failed to create levy"}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Levy Name (e.g. Lunch Program)
            </label>
            <input
              type="text"
              className="edtech-input"
              placeholder="Enter official fee name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Amount per Student
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-alert-crimson font-bold text-sm">KES</span>
              </div>
              <input
                type="number"
                className="edtech-input pl-12 financial-data text-white text-lg font-bold"
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Term
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-app-background/70" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border text-app-background border-white/20"
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({ ...formData, term: e.target.value })
                  }
                >
                  <option className="bg-text-border text-app-background" value="Term 1">Term 1</option>
                  <option className="bg-text-border text-app-background" value="Term 2">Term 2</option>
                  <option className="bg-text-border text-app-background" value="Term 3">Term 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Cohort
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-app-background/70" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border text-app-background border-white/20"
                  value={formData.target_cohort}
                  onChange={(e) =>
                    setFormData({ ...formData, target_cohort: e.target.value })
                  }
                >
                  <option className="bg-text-border text-app-background" value="All Students">All Students</option>
                  
                  <option className="bg-text-border text-app-background" value="Grade 10">Grade 10</option>
                  <option className="bg-text-border text-app-background" value="Form 3">Form 3</option>
                  <option className="bg-text-border text-app-background" value="Form 4">Form 4</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="edtech-btn-secondary !px-6 !py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="edtech-btn !px-6 !py-2 text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Levy"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
