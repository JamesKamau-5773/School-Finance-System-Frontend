import React, { useState } from "react";
import { X, User, Phone, MessageSquare, Plus, Receipt } from "lucide-react";
import { useStudentLedger } from "./hooks/useStudents";
import ReceivePaymentModal from "./ReceivePaymentModal";

export default function StudentProfileModal({ isOpen, onClose, student }) {
  const { data: response, isLoading } = useStudentLedger(student?.id);
  const ledgerHistory = response?.data || [];

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B14]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl edtech-card border border-white/10 !bg-[#0B192C]/95 p-0 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl shadow-[#05CD99]/5 rounded-xl">
        {/* Header: Student Identity & Action Buttons */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-start bg-black/40">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1A4D5C] border border-[#05CD99]/30 flex items-center justify-center text-[#05CD99]">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {student.full_name}
              </h2>
              <div className="flex items-center gap-3 text-sm mt-1">
                <span className="text-[#FFC107] font-mono tracking-wider">
                  {student.admission_number}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-bold uppercase">
                  {student.grade_level}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full bg-white/5 hover:bg-rose-500/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dashboard Strip: Balance & Communication */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-b border-white/10 bg-black/20">
          {/* Balance Indicator */}
          <div className="p-6 flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Current Balance
            </span>
            {student.balance > 0 ? (
              <span className="text-3xl financial-data font-bold text-rose-400">
                KES{" "}
                {student.balance.toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                })}
              </span>
            ) : (
              <span className="text-3xl financial-data font-bold text-[#05CD99]">
                CLEARED
              </span>
            )}
          </div>

          {/* Sponsor Contact Info */}
          <div className="p-6 border-l border-white/5 flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Financial Sponsor
            </span>
            <div className="text-white font-bold">{student.sponsor.name}</div>
            <div className="flex items-center gap-2 text-sm text-slate-300 mt-1 font-mono">
              <Phone size={14} className="text-[#05CD99]" />
              {student.sponsor.phone}
              <span className="font-sans text-xs text-slate-500">
                ({student.sponsor.relation})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-l border-white/5 flex flex-col gap-3 justify-center">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full py-2 bg-[#05CD99] hover:bg-[#04B083] text-[#050B14] text-sm font-bold flex items-center justify-center gap-2 rounded-lg transition-all shadow-[0_4px_14px_0_rgba(5,205,153,0.39)]"
            >
              <Plus size={16} />
              Receive Payment
            </button>
            <button className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-bold flex items-center justify-center gap-2 rounded-lg transition-all">
              <MessageSquare size={16} />
              Send SMS Reminder
            </button>
          </div>
        </div>

        {/* Ledger History Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Receipt size={16} className="text-slate-500" />
            Account Statement History
          </h3>

          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date / Ref
                </th>
                <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Invoice (DR)
                </th>
                <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Payment (CR)
                </th>
              </tr>
            </thead>
            <tbody className="financial-data text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">
                    Loading ledger records...
                  </td>
                </tr>
              ) : ledgerHistory.length > 0 ? (
                ledgerHistory.map((entry, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="text-slate-300">
                        {entry.date.split(" ")[0]}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {entry.reference_no}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-200">
                      {entry.description}
                    </td>
                    <td className="py-3 px-4 text-right text-rose-400/80 font-mono">
                      {entry.entry_type === "DEBIT"
                        ? entry.amount.toLocaleString("en-KE", {
                            minimumFractionDigits: 2,
                          })
                        : "-"}
                    </td>
                    <td className="py-3 pl-4 text-right text-[#05CD99] font-mono">
                      {entry.entry_type === "CREDIT"
                        ? entry.amount.toLocaleString("en-KE", {
                            minimumFractionDigits: 2,
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-slate-600 italic"
                  >
                    No financial records found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the Payment Modal on top if activated */}
      <ReceivePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={student}
      />
    </div>
  );
}
