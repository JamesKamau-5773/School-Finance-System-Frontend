import React from 'react';
import { PieChart } from 'lucide-react';
import { useVoteHeads, useSummary } from './hooks/useCashbook';

export default function VoteHeadDistribution() {
  const { data: voteHeadData, isLoading: isLoadingVotes } = useVoteHeads();
  const { data: summaryData } = useSummary();
  const glassPanelClass =
    "rounded-3xl border border-app-background/45 bg-app-background/18 backdrop-blur-2xl shadow-xl shadow-structural-navy/45";

  const voteHeads = Array.isArray(voteHeadData)
    ? voteHeadData
    : Array.isArray(voteHeadData?.data)
      ? voteHeadData.data
      : [];

  const summary = summaryData && typeof summaryData === 'object'
    ? summaryData
    : { total_collections: 0 };

  const totalIncome = summary.total_collections || summary.total_income || 1; // Prevent division by zero

  if (isLoadingVotes) return null;

  return (
    <div className={`mb-10 overflow-hidden mt-6 p-6 ${glassPanelClass}`}>
      <div className="border-b border-app-background/35 pb-4 mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-app-background flex items-center gap-2">
          <PieChart className="text-alert-crimson" size={20} />
          MoE Vote Head Distribution
        </h3>
        <span className="text-xs font-bold px-3 py-1 bg-app-background/28 text-app-background tracking-wider rounded-full border border-app-background/50 uppercase">
          Statutory Allocation
        </span>
      </div>

      <div className="space-y-6">
        {voteHeads.length === 0 ? (
          <p className="text-app-background/60 text-sm font-medium italic">No MoE allocations recorded yet.</p>
        ) : (
          voteHeads.map((vh, index) => {
            const balance = vh.current_balance || 0;
            const configuredPercentage = Number(
              vh?.percentage ?? vh?.allocation_percentage ?? vh?.moe_percentage,
            );
            const percentage = Number.isFinite(configuredPercentage)
              ? configuredPercentage
              : !totalIncome || !balance
                ? 0
                : (balance / totalIncome) * 100;
            const numericPercentage = isNaN(percentage) ? 0 : percentage;
            const displayPercentage = numericPercentage.toFixed(1);
            const widthPercentage = Math.min(Math.max(numericPercentage, 0), 100);
            
            return (
              <div key={index} className="relative">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-app-background/85 tracking-wide uppercase">{vh.name}</span>
                  <div className="text-right">
                    <span className="text-app-background financial-data mr-3">
                      KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-action-mint w-16 inline-block text-right">{displayPercentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-app-background/22 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-action-mint/70 to-action-mint rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${widthPercentage}%` }}
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