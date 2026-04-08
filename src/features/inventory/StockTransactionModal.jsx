import React, { useState, useEffect } from "react";
import {
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAddStock, useConsumeStock } from "./hooks/useInventory";

export default function StockTransactionModal({ isOpen, onClose, item, type }) {
  const isReceiving = type === "IN";
  const displayUnit = (item?.unit_of_measure || "")
    .replace(/^\d+\s*/u, "")
    .trim();

  const [formData, setFormData] = useState({
    quantity: "",
    party_name: "",
    reference_no: "",
    remarks: "",
  });

  const {
    mutate: addStock,
    isPending: isAdding,
    error: addError,
  } = useAddStock();
  const {
    mutate: consumeStock,
    isPending: isConsuming,
    error: consumeError,
  } = useConsumeStock();

  const isPending = isAdding || isConsuming;
  const error = addError || consumeError;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: "",
        party_name: "",
        reference_no: "",
        remarks: "",
      });
    }
  }, [isOpen, type]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Number(formData.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    const payload = {
      item_id: item.id,
      quantity,
      remarks: formData.remarks,
    };

    if (isReceiving) {
      payload.supplier = formData.party_name;
      payload.reference_no = formData.reference_no;
      addStock(payload, { onSuccess: onClose });
    } else {
      // Consumption
      payload.remarks = `Issued to: ${formData.party_name}. ${formData.remarks}`;
      consumeStock(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md edtech-card border border-white/10 !bg-text-border/95 p-0 overflow-hidden shadow-2xl rounded-xl">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b border-white/10 flex justify-between items-center ${isReceiving ? "bg-action-mint/10" : "bg-rose-500/10"}`}
        >
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${isReceiving ? "text-action-mint" : "text-rose-400"}`}
          >
            {isReceiving ? (
              <ArrowDownToLine size={20} />
            ) : (
              <ArrowUpFromLine size={20} />
            )}
            {isReceiving ? "Receive Stock (IN)" : "Issue Stock (OUT)"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Target Item Display */}
          <div className="mb-6 bg-structural-navy border border-text-border p-4 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-white font-bold">{item.name}</div>
              <div className="text-xs text-alert-crimson font-mono mt-1">
                {item.item_code}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Available
              </div>
              <div className="text-action-mint font-mono font-bold">
                {item.current_stock.toLocaleString("en-KE", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/50 rounded flex items-start gap-3 text-rose-400 text-sm font-bold">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                {error?.response?.data?.error ||
                  error?.response?.data?.message ||
                  "Transaction failed."}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={!isReceiving ? Math.floor(Number(item.current_stock) || 0) : undefined}
                  className="w-full bg-structural-navy border border-text-border text-white px-4 pr-24 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  {displayUnit || item.unit_of_measure}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                {isReceiving
                  ? "Supplier Name"
                  : "Issued To (Department/Person)"}
              </label>
              <input
                type="text"
                className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                value={formData.party_name}
                onChange={(e) =>
                  setFormData({ ...formData, party_name: e.target.value })
                }
                required
              />
            </div>

            {isReceiving && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Delivery Note / Ref No
                </label>
                <input
                  type="text"
                  className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
                  value={formData.reference_no}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_no: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Remarks (Optional)
              </label>
              <textarea
                className="w-full bg-structural-navy border border-text-border text-white px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg resize-none"
                rows="2"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2 bg-transparent text-slate-400 hover:text-white border border-text-border rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2 text-structural-navy rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isReceiving
                  ? "bg-action-mint hover:bg-action-mint"
                  : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing
                </>
              ) : (
                "Confirm Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
