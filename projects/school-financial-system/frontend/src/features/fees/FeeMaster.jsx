import React, { useState } from "react";
import { WalletCards, Plus, Users } from "lucide-react";
import { useFeeStructures } from "./hooks/useFees";
import CreateLevyModal from "./CreateLevyModal";

export default function FeeMaster() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: response, isLoading } = useFeeStructures({});

  const fees = response?.data || [];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <WalletCards className="text-[#FFC107]" size={28} />
            Fee Master
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            BOM Levies & Cohort Billing Engine
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="edtech-btn">
          <Plus size={18} />
          Define New Levy
        </button>
      </div>

      {/* Catalog Table */}
      <div className="edtech-card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">
            Active Fee Structures (2026)
          </h3>
        </div>

        <table
          className="w-full text-left"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr className="border-b border-white/10 bg-black/40">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Levy Name
              </th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Cohort
              </th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                Term
              </th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                Amount (KES)
              </th>
            </tr>
          </thead>
          <tbody className="financial-data text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  Loading catalog...
                </td>
              </tr>
            ) : fees.length > 0 ? (
              fees.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-sans text-white font-bold">
                    {fee.name}
                  </td>
                  <td className="p-4 font-sans text-slate-300">
                    <span className="inline-flex items-center gap-2 bg-[#1A4D5C]/50 text-[#05CD99] px-2.5 py-1 rounded-full text-xs font-bold border border-[#05CD99]/20">
                      <Users size={12} /> {fee.target_cohort}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-sans">
                    {fee.term}
                  </td>
                  <td className="p-4 text-right text-emerald-400 font-bold text-base">
                    {fee.amount.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-slate-500 italic"
                >
                  No active levies found. Click "Define New Levy" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateLevyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
