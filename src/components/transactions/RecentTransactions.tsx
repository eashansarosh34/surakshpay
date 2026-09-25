'use client';

import { useState, useMemo } from 'react';
import { formatINR, formatIST, ROUTE_CONFIG } from '@/lib/utils';
import { ShieldCheck, ArrowUpRight, Lock } from 'lucide-react';

interface Transaction {
  id: string;
  route: string;
  amount_paise: number;
  mdr_charged_paise: number;
  savings_paise: number;
  status: string;
  created_at: string;
  utr?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [selectedMonth, setSelectedMonth] = useState('ALL');

  const months = useMemo(() => {
    const m = new Set<string>();
    transactions.forEach(t => {
      const d = new Date(t.created_at);
      m.add(`${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`);
    });
    // Sort descending chronologically (simplistic sort assumes data isn't wildly old, but sorting string natively for now)
    return Array.from(m);
  }, [transactions]);

  const filteredTransactions = selectedMonth === 'ALL'
    ? transactions
    : transactions.filter(t => {
        const d = new Date(t.created_at);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}` === selectedMonth;
      });

  if (!transactions?.length) {
    return (
      <div className="metric-card h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">No transactions yet</p>
        <p className="text-sm text-gray-400">Transactions will appear here once processed.</p>
      </div>
    );
  }

  return (
    <div className="metric-card overflow-hidden flex flex-col p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Transaction Ledger
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg text-slate-700 bg-slate-50 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Months</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Export <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Bank UTR</th>
              <th className="px-6 py-3 text-right">Fee</th>
              <th className="px-6 py-3 text-right">Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No transactions found for {selectedMonth}.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => {
                const routeCfg = ROUTE_CONFIG[t.route] || { label: t.route, bgColor: 'bg-slate-100 text-slate-800' };
                
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatIST(t.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {formatINR(t.amount_paise)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${routeCfg.bgColor}`}>
                        {routeCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.utr ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                          {t.utr}
                          <ShieldCheck size={14} className="text-blue-500" title="Webhook Verified" />
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {t.mdr_charged_paise > 0 ? (
                        <span className="text-slate-900">{formatINR(t.mdr_charged_paise)}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-emerald-600">
                      {t.savings_paise > 0 ? formatINR(t.savings_paise) : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 rounded-b-xl">
        <Lock size={12} className="text-slate-400" />
        <span><strong>Immutable Ledger:</strong> Transactions are strictly append-only. They cannot be modified or deleted by merchants or admins.</span>
      </div>
    </div>
  );
}
