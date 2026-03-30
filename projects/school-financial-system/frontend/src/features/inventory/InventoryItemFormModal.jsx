import React, { useState, useEffect } from "react";
import {
  X,
  PackagePlus,
  Edit3,
  Loader2,
  Tag,
  Scale,
  AlertTriangle,
} from "lucide-react";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from "./hooks/useInventory";

export default function InventoryItemFormModal({
  isOpen,
  onClose,
  initialData,
}) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    item_code: "",
    name: "",
    category: "Foodstuff",
    unit_of_measure: "KGs",
    reorder_level: 0,
  });

  const { mutate: createItem, isPending: isCreating } =
    useCreateInventoryItem();
  const { mutate: updateItem, isPending: isUpdating } =
    useUpdateInventoryItem();
  const isPending = isCreating || isUpdating;
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        item_code: initialData.item_code,
        name: initialData.name,
        category: initialData.category,
        unit_of_measure: initialData.unit_of_measure,
        reorder_level: initialData.reorder_level,
      });
    } else if (isOpen) {
      setFormData({
        item_code: "",
        name: "",
        category: "Foodstuff",
        unit_of_measure: "KGs",
        reorder_level: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    const handleError = (error) => {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save item.";

      if (status === 401) {
        setSubmitError(
          "Unauthorized: Missing or expired login token. Please authenticate and try again.",
        );
        return;
      }

      setSubmitError(message);
    };

    if (isEditMode) {
      updateItem(
        { id: initialData.id, data: formData },
        { onSuccess: onClose, onError: handleError },
      );
    } else {
      createItem(formData, { onSuccess: onClose, onError: handleError });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050B14]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg edtech-card border border-[#1A4D5C] !bg-[#0B192C]/95 p-0 overflow-hidden shadow-2xl rounded-xl">
        <div className="px-6 py-4 border-b border-[#1A4D5C] flex justify-between items-center bg-[#050B14]/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isEditMode ? (
              <Edit3 className="text-[#05CD99]" size={20} />
            ) : (
              <PackagePlus className="text-[#05CD99]" size={20} />
            )}
            {isEditMode ? "Edit Catalog Item" : "Define New Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Item Code
              </label>
              <div className="relative">
                <Tag
                  size={14}
                  className="absolute left-3 top-3 text-[#05CD99]"
                />
                <input
                  type="text"
                  disabled={isEditMode}
                  className="w-full bg-[#050B14] border border-[#1A4D5C] text-[#FFC107] font-mono pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#05CD99] rounded-lg disabled:opacity-50 uppercase"
                  placeholder="e.g. ITM-MZ-01"
                  value={formData.item_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      item_code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Category
              </label>
              <select
                className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#05CD99] rounded-lg appearance-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Foodstuff">Foodstuff</option>
                <option value="Stationery">Stationery</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Hardware">Hardware & Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Item Name
            </label>
            <input
              type="text"
              className="w-full bg-[#050B14] border border-[#1A4D5C] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#05CD99] rounded-lg"
              placeholder="e.g. Grade 1 Maize Flour"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Unit of Measure
              </label>
              <div className="relative">
                <Scale
                  size={14}
                  className="absolute left-3 top-3 text-[#05CD99]"
                />
                <input
                  type="text"
                  className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#05CD99] rounded-lg"
                  placeholder="e.g. Bags (90kg)"
                  value={formData.unit_of_measure}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit_of_measure: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <AlertTriangle size={12} className="text-rose-400" /> Reorder
                Level
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-[#050B14] border border-[#1A4D5C] text-rose-400 font-mono font-bold px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#05CD99] rounded-lg"
                value={formData.reorder_level}
                onChange={(e) =>
                  setFormData({ ...formData, reorder_level: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#1A4D5C] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-bold uppercase transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#05CD99] text-[#050B14] hover:bg-[#04B083] rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(5,205,153,0.2)]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving
                </>
              ) : (
                "Save Catalog Item"
              )}
            </button>
          </div>

          {submitError && (
            <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {submitError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
