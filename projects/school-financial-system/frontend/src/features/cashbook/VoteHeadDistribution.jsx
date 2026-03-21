import React from 'react';
import { PieChart } from 'lucide-react';
import { useVoteHeads, useSummary } from './hooks/useCashbook';

export default function VoteHeadDistribution() {
  const { data: voteHeads = [], isLoading: isLoadingVotes } = useVoteHeads();
  const { data: summary = { total_collections: 0 } } = useSummary();

  const totalIncome = summary.total_collections || 1; // Prevent division by zero

  if (isLoadingVotes) return null;

  return (
    <div className="edtech-card mb-10 overflow-hidden mt-6">
      <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <PieChart className="text-[#FFC107]" size={20} />
          MoE Vote Head Distribution
        </h3>
        <span className="text-xs font-bold px-3 py-1 bg-white/5 text-white/60 tracking-wider rounded-full border border-white/10 uppercase">
          Statutory Allocation
        </span>
      </div>

      <div className="space-y-6">
        {voteHeads.length === 0 ? (
          <p className="text-white/50 text-sm font-medium italic">No MoE allocations recorded yet.</p>
        ) : (
          voteHeads.map((vh, index) => {
            const balance = vh.current_balance || 0;
            const percentage = !totalIncome || !balance ? 0 : ((balance / totalIncome) * 100);
            const displayPercentage = isNaN(percentage) ? 0 : percentage.toFixed(1);
            
            return (
              <div key={index} className="relative">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-white/80 tracking-wide uppercase">{vh.name}</span>
                  <div className="text-right">
                    <span className="text-white financial-data mr-3">
                      KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[#05CD99] w-16 inline-block text-right">{displayPercentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-[#05CD99] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${displayPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}