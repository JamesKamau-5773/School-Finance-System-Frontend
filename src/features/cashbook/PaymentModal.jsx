import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { X, User, Receipt, CreditCard, Hash, Loader2, Check, Printer } from "lucide-react";
import { useSubmitPayment } from "./hooks/useCashbook";
import { financeApi } from "../../api/financeApi";
import PrintableReceipt from "../finance/PrintableReceipt";
import { amountInWordsShort } from "../../utils/numberToWords";

export default function PaymentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    method: "MPESA",
    reference: "",
  });

  const [confirmedStudent, setConfirmedStudent] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const receiptRef = useRef(null);

  const {
    mutate: submitPayment,
    isPending,
    isError,
    error,
  } = useSubmitPayment();

  useEffect(() => {
    if (!isOpen) return;

    const searchTerm = formData.studentId.trim();
    let isCancelled = false;

    if (!searchTerm) {
      setConfirmedStudent(null);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await financeApi.getStudentDirectory({
          search: searchTerm,
        });

        const students = Array.isArray(response) ? response : response?.data || [];

        if (isCancelled) return;

        const normalizedSearch = searchTerm.toLowerCase().replace(/\s+/g, " ").trim();
        const matchesStudent = (student) => {
          const admission = String(student?.admission_number || "").toLowerCase();
          const fullName = String(student?.full_name || student?.name || "").toLowerCase();
          const studentId = String(student?.id || "").toLowerCase();
          return (
            admission.includes(normalizedSearch) ||
            fullName.includes(normalizedSearch) ||
            studentId.includes(normalizedSearch)
          );
        };

        let candidateList = students;

        if (candidateList.length === 0) {
          console.warn("[PaymentModal] Search endpoint returned no records; falling back to full directory lookup", {
            searchTerm,
          });
          const fullDirectoryResponse = await financeApi.getStudentDirectory({});
          if (isCancelled) return;
          const fullDirectory = Array.isArray(fullDirectoryResponse)
            ? fullDirectoryResponse
            : fullDirectoryResponse?.data || [];
          candidateList = fullDirectory.filter(matchesStudent);

          if (candidateList.length > 0) {
            console.info("[PaymentModal] Student matched from fallback directory filter", {
              searchTerm,
              matches: candidateList.length,
            });
          }
        }

        if (candidateList.length === 0) {
          console.warn("[PaymentModal] No student match after search + fallback", {
            searchTerm,
          });
          setConfirmedStudent(null);
          setSearchError("Student not found in directory.");
          return;
        }

        const exactMatch = candidateList.find((student) => {
          const admission = String(student?.admission_number || "").toLowerCase();
          const fullName = String(student?.full_name || student?.name || "").toLowerCase();
          const studentId = String(student?.id || "").toLowerCase();
          return (
            admission === normalizedSearch ||
            fullName === normalizedSearch ||
            studentId === normalizedSearch
          );
        });

        const student = exactMatch || candidateList[0];
        setConfirmedStudent({
          id: student.id,
          name: student.full_name || student.name,
          admissionNumber: student.admission_number,
          balance: student.balance || 0,
        });
      } catch (err) {
        if (isCancelled) return;
        console.error("Student lookup failed:", err);
        setConfirmedStudent(null);
        setSearchError(err?.response?.data?.message || "Failed to verify student");
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [formData.studentId, isOpen]);

  if (!isOpen) return null;

  const buildReceiptPayload = (responsePayload) => {
    const payload = responsePayload?.receipt || responsePayload?.data?.receipt || responsePayload?.data || responsePayload || {};
    const rawAllocations = Array.isArray(payload?.allocations)
      ? payload.allocations
      : Array.isArray(payload?.data?.allocations)
        ? payload.data.allocations
        : [];

    const normalizedAmount = Number(payload?.totals?.paid_amount || payload?.paid_amount || formData?.amount || 0) || 0;
    const existingBalance = Number(confirmedStudent?.balance || 0) || 0;
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
        name: payload?.student?.name || payload?.student_name || confirmedStudent?.name || "",
        form: payload?.student?.form || payload?.student?.grade_level || confirmedStudent?.form || "",
        term: payload?.student?.term || payload?.term || "",
        year: payload?.student?.year || payload?.year || new Date().getFullYear(),
        adm_no: payload?.student?.adm_no || payload?.student?.admission_number || confirmedStudent?.admissionNumber || "",
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

  const resetModalState = () => {
    setFormData({
      studentId: "",
      amount: "",
      method: "MPESA",
      reference: "",
    });
    setConfirmedStudent(null);
    setSearchError(null);
    setReceiptData(null);
    setSuccessMessage("");
  };

  const handleClose = () => {
    resetModalState();
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
            @page { size: A5 portrait; margin: 6mm; }
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
    if (!confirmedStudent) {
      setSearchError("Student must exist in the directory before payment.");
      return;
    }

    submitPayment(
      {
        studentId: confirmedStudent.id,
        amount: formData.amount,
        method: formData.method,
        reference: formData.reference,
      },
      {
        onSuccess: (response) => {
          setReceiptData(buildReceiptPayload(response));
          setSuccessMessage("Payment recorded successfully. You can now print the official receipt.");
          setFormData((prev) => ({
            ...prev,
            amount: "",
            reference: "",
          }));
        },
      }
    );
  };

  return (
    /* Modal Backdrop - Dark and Blurred */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-structural-navy/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-text-border/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="text-alert-crimson" size={20} />
            Record Payment
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {searchError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm font-bold">
              {searchError}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-action-mint/15 border border-action-mint/40 rounded-lg text-action-mint text-sm font-bold">
              {successMessage}
            </div>
          )}

          {isError && !searchError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm font-bold">
              {error?.response?.data?.message || error?.message || "Payment failed"}
            </div>
          )}

          {/* Student Search / ID */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Student ID / Adm No
            </label>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                className="edtech-input pl-10 pr-10 w-full"
                placeholder="e.g. ADM-2024-001"
                value={formData.studentId}
                onChange={(e) => {
                  setFormData({ ...formData, studentId: e.target.value });
                  setSearchError(null);
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                ) : confirmedStudent ? (
                  <Check size={16} className="text-action-mint" />
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-xs">
              {isSearching ? (
                <span className="text-slate-400">Verifying student automatically...</span>
              ) : confirmedStudent ? (
                <span className="text-action-mint">Student verified. You can now confirm payment below.</span>
              ) : formData.studentId.trim() && !searchError ? (
                <span className="text-slate-400">Searching directory...</span>
              ) : (
                <span className="text-slate-500">Student verification runs automatically as you type.</span>
              )}
            </p>
          </div>

          {/* Confirmed Student Banner */}
          {confirmedStudent && (
            <div className="bg-black/40 px-4 py-3 border border-action-mint/30 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  <Check size={16} className="text-action-mint" />
                  {confirmedStudent.name}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {confirmedStudent.admissionNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                  Current Balance
                </div>
                <div className="text-rose-400 font-bold financial-data">
                  KES{" "}
                  {confirmedStudent.balance?.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </div>
              </div>
            </div>
          )}

          {/* Amount Received */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Amount Received (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-emerald-400 font-bold text-sm">
                  KES
                </span>
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
                  className="edtech-input pl-10 appearance-none bg-text-border"
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
              onClick={handleClose}
              disabled={isPending}
              className="edtech-btn-secondary px-4 py-2 rounded-full text-sm font-bold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={!receiptData || isPending}
              className="edtech-btn-secondary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Printer size={16} />
              Print Receipt
            </button>
            <button
              type="submit"
              disabled={isPending || !confirmedStudent || !formData.amount}
              className="edtech-btn bg-action-mint hover:bg-action-mint/80 !text-structural-navy px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>

        {receiptData ? <PrintableReceipt ref={receiptRef} data={receiptData} /> : null}
      </div>
    </div>
  );
}
