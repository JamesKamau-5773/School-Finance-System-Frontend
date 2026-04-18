import React, { useState, useRef } from "react";
import { X, WalletCards, Receipt, Building2, Loader2, Printer } from "lucide-react";
import { useReceivePayment } from "./hooks/useStudents";
import PrintableReceipt from "../finance/PrintableReceipt";

export default function ReceivePaymentModal({ isOpen, onClose, student }) {
  const [formData, setFormData] = useState({
    amount: "",
    method: "Bank Slip",
    reference: "",
  });

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef(null);

  const {
    mutate: processPayment,
    isPending,
    isError,
    error,
  } = useReceivePayment();

  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    processPayment(
      {
        student_id: student.id,
        amount: formData.amount,
        method: formData.method,
        reference: formData.reference,
      },
      {
        onSuccess: (response) => {
          // Transform API response to receipt data structure
          const amount = parseFloat(formData.amount);
          
          // Map allocations from API response or create default GOK vote heads structure
          let allocations = [];
          
          if (response?.allocations && Array.isArray(response.allocations) && response.allocations.length > 0) {
            // Use allocations from API if available
            allocations = response.allocations;
          } else {
            // Fallback: Create allocation for the full amount to Lunch Programme
            allocations = [
              {
                vote_head: "Lunch Programme",
                amount: amount,
              },
            ];
          }
          
          const today = new Date();
          const dateFormatter = new Intl.DateTimeFormat("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          
          const receiptInfo = {
            receipt_no: response?.receipt_id || response?.id || "N/A",
            date: dateFormatter.format(today),
            student: {
              name: student.full_name,
              admissionNumber: student.admission_number,
              form: student.form || student.grade_level || "",
              gradeLevel: student.form || student.grade_level || "",
              term: student.term || "",
              year: today.getFullYear().toString(),
              balance: student.balance || 0,
            },
            allocations: allocations,
            totals: {
              amount: amount,
            },
            meta: {
              paymentMethod: formData.method,
              reference: formData.reference,
              receivedBy: response?.recorded_by || "School Officer",
            },
          };

          setReceiptData(receiptInfo);
          setShowReceipt(true);
        },
      },
    );
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      window.print();
    }
  };

  const handleDone = () => {
    // Reset state and close modal
    setFormData({ amount: "", method: "Bank Slip", reference: "" });
    setShowReceipt(false);
    setReceiptData(null);
    onClose();
  };

  // Receipt Success View
  if (showReceipt && receiptData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-structural-navy/90 backdrop-blur-md p-4">
        <div className="w-full max-w-3xl edtech-card border border-action-mint/30 !bg-text-border p-0 overflow-hidden shadow-2xl shadow-[#00E98F]/10">
          {/* Header with Print Button */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-action-mint/10">
            <h2 className="text-lg font-bold text-action-mint flex items-center gap-2">
              <Receipt size={20} />
              Payment Receipt
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="edtech-btn bg-action-mint hover:bg-action-mint/80 !text-structural-navy px-4 py-2 text-sm flex items-center gap-2 shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDone}
                className="text-action-mint/70 hover:text-action-mint transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Receipt Component (Print View) */}
          <div className="p-6 max-h-[70vh] overflow-y-auto print:p-0 print:max-h-none print:overflow-visible">
            <PrintableReceipt ref={receiptRef} data={receiptData} />
          </div>

          {/* Receipt Footer / Actions */}
          <div className="px-6 py-4 flex justify-end gap-3 border-t border-white/10 bg-action-mint/5">
            <button
              onClick={handleDone}
              className="edtech-btn-secondary !px-6 !py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-structural-navy/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md edtech-card border border-action-mint/30 !bg-text-border p-0 overflow-hidden shadow-2xl shadow-[#00E98F]/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-action-mint/10">
          <h2 className="text-lg font-bold text-action-mint flex items-center gap-2">
            <WalletCards size={20} />
            Receive Fee Payment
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={!receiptData}
              className="edtech-btn bg-action-mint hover:bg-action-mint/80 !text-structural-navy px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
              title={receiptData ? "Print receipt" : "Complete a payment first"}
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-action-mint/70 hover:text-action-mint transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Student Target Banner */}
        <div className="bg-black/40 px-6 py-3 border-b border-white/5 flex justify-between items-center">
          <div>
            <div className="text-white font-bold text-sm">
              {student.full_name}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {student.admission_number}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
              Current Balance
            </div>
            <div className="text-rose-400 font-bold financial-data">
              KES{" "}
              {student.balance?.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm font-bold">
              {error?.response?.data?.message ||
                "Transaction failed. Check reference number."}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Deposit Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-action-mint font-bold text-sm">KES</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="edtech-input pl-12 financial-data text-emerald-400 text-xl font-bold border-action-mint/30 focus:border-action-mint focus:ring-action-mint/20"
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
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Method
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 size={16} className="text-slate-400" />
                </div>
                <select
                  className="edtech-input pl-10 appearance-none bg-text-border"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option value="Bank Slip">Bank Slip</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Banker's Cheque">Banker's Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {formData.method === "M-Pesa" ? "M-Pesa Code" : "Slip / Ref No"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Receipt size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="edtech-input pl-10 uppercase font-mono"
                  placeholder={
                    formData.method === "M-Pesa" ? "e.g. QX12..." : "Slip No..."
                  }
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

          {/* Action Footer */}
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
              className="edtech-btn !bg-action-mint hover:!bg-action-mint !text-structural-navy !px-6 !py-2 text-sm shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                "Confirm Deposit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
