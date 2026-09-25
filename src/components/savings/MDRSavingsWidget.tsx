'use client';

import { formatINR } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, TrendingDown } from 'lucide-react';

interface MDRSavingsWidgetProps {
  total_mdr_charged_paise: number;
  total_mdr_saved_paise: number;
  transaction_count: number;
}

export function MDRSavingsWidget({
  total_mdr_charged_paise,
  total_mdr_saved_paise,
  transaction_count,
}: MDRSavingsWidgetProps) {
  const effectiveRate = transaction_count > 0 && (total_mdr_charged_paise + total_mdr_saved_paise) > 0
    ? (total_mdr_charged_paise / (total_mdr_charged_paise + total_mdr_saved_paise)) * 0.4
    : 0;

  return (
    <div className="metric-card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <TrendingDown size={18} />
        </div>
        <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wide">
          Total Fees Saved
        </h3>
      </div>

      <div className="mb-6">
        <p className="text-4xl font-bold text-emerald-900">
          {formatINR(total_mdr_saved_paise)}
        </p>
        <p className="text-sm text-emerald-700 mt-1 font-medium">
          Saved compared to standard 0.4% fees
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <ArrowDownRight size={14} className="text-red-400" />
            Fees Paid
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatINR(total_mdr_charged_paise)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <ArrowUpRight size={14} className="text-emerald-500" />
            Average Fee %
          </div>
          <p className="text-lg font-bold text-gray-900">
            {effectiveRate.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
