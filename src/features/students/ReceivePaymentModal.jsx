import React, { useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { X, WalletCards, Receipt, Building2, Loader2, Printer } from "lucide-react";
import { useReceivePayment } from "./hooks/useStudents";
import PrintableReceipt from "../finance/PrintableReceipt";
import { amountInWordsShort } from "../../utils/numberToWords";

export default function ReceivePaymentModal({ isOpen, onClose, student }) {
  const receiptRef = useRef(null);
  const [formData, setFormData] = useState({
    amount: "",
    method: "Bank Slip",
    reference: "",
  });
  const [receiptData, setReceiptData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    mutate: processPayment,
    isPending,
    isError,
    error,
  } = useReceivePayment();

  if (!isOpen || !student) return null;

  const buildReceiptPayload = (responsePayload) => {
    const payload = responsePayload?.receipt || responsePayload?.data?.receipt || responsePayload?.data || responsePayload || {};
    const rawAllocations = Array.isArray(payload?.allocations)
      ? payload.allocations
      : Array.isArray(payload?.data?.allocations)
        ? payload.data.allocations
        : [];

    const normalizedAmount = Number(payload?.totals?.paid_amount || payload?.paid_amount || formData?.amount || 0) || 0;
    const existingBalance = Number(student?.balance || 0) || 0;
    const computedBalance = Math.max(0, existingBalance - normalizedAmount);
    const normalizedBalance = Number(
      payload?.totals?.balance ??
        payload?.totals?.fees_balance ??
        payload?.fees_balance ??
        payload?.student?.balance ??
        payload?.balance ??
        payload?.new_balance ??
        payload?.remaining_balance ??
        computedBalance,
    ) || 0;

    const receiptNoSource = String(
      payload?.receipt_no || payload?.receiptNumber || payload?.id || Date.now(),
    ).replace(/\D/g, "");
    const receiptNo = receiptNoSource.slice(-4).padStart(4, "0");

    return {
      receipt_no: receiptNo,
      date: payload?.date || new Date().toISOString(),
      student: {
        name: payload?.student?.name || payload?.student_name || student?.full_name || "",
        form: payload?.student?.form || payload?.student?.grade_level || student?.grade_level || "",
        term: payload?.student?.term || payload?.term || "",
        year: payload?.student?.year || payload?.year || new Date().getFullYear(),
        adm_no: payload?.student?.adm_no || payload?.student?.admission_number || student?.admission_number || "",
        balance: normalizedBalance,
      },
      allocations: rawAllocations,
      totals: {
        paid_amount: normalizedAmount,
        amount_in_words: payload?.totals?.amount_in_words || payload?.amount_in_words || `${amountInWordsShort(normalizedAmount)} Only`,
        balance: normalizedBalance,
      },
      meta: {
        receiving_officer: payload?.meta?.receiving_officer || payload?.receiving_officer || "",
        reference_no: payload?.meta?.reference_no || payload?.reference_no || formData?.reference || "",
        fees_balance: normalizedBalance,
      },
    };
  };

  const handleModalClose = () => {
    setReceiptData(null);
    setSuccessMessage("");
    onClose();
  };

  const handlePrint = () => {
    if (!receiptData) return;

    const printContent = ReactDOMServer.renderToString(
      <PrintableReceipt data={receiptData} ref={receiptRef} />,
    );
    const sharedStyles = Array.from(
      document.querySelectorAll("link[rel='stylesheet'], style"),
    )
      .map((node) => node.outerHTML)
      .join("\n");

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          ${sharedStyles}
          <style>
            @page { size: A5 portrait; margin: 10mm; }
            html, body { margin: 0; padding: 0; background: #ffffff; color: #000000; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    }, 300);
  };

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
          setReceiptData(buildReceiptPayload(response));
          setSuccessMessage("Payment recorded successfully. You can now print the official receipt.");
          setFormData({ amount: "", method: "Bank Slip", reference: "" });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-structural-navy/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md edtech-card border border-action-mint/30 !bg-text-border p-0 overflow-hidden shadow-2xl shadow-[#00E98F]/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-action-mint/10">
          <h2 className="text-lg font-bold text-action-mint flex items-center gap-2">
            <WalletCards size={20} />
            Receive Fee Payment
          </h2>
          <button
            onClick={onClose}
            className="text-action-mint/70 hover:text-action-mint transition-colors p-1"
          >
            <X size={20} />
          </button>
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
          {successMessage && (
            <div className="p-3 bg-action-mint/15 border border-action-mint/40 rounded-lg text-action-mint text-sm font-bold">
              {successMessage}
            </div>
          )}

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
              onClick={handleModalClose}
              disabled={isPending}
              className="edtech-btn-secondary !px-6 !py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={!receiptData || isPending}
              className="edtech-btn-secondary !px-6 !py-2 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Printer size={16} />
              Print Receipt
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

        {receiptData ? <PrintableReceipt ref={receiptRef} data={receiptData} /> : null}
      </div>
    </div>
  );
}
