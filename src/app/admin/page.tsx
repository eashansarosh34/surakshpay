'use client';

import { useState, useEffect } from 'react';
import { MOCK_DAILY_MONITORING } from '@/lib/mock-data';
import { USE_MOCK } from '@/lib/api';
import api from '@/lib/api';
import { formatINR, formatINRCompact } from '@/lib/utils';
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Users, Search, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { RecentTransactions } from '@/components/transactions/RecentTransactions';
import { MOCK_DASHBOARD } from '@/lib/mock-data';

export default function AdminMonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  useEffect(() => {
    async function fetchMonitoring() {
      try {
        if (USE_MOCK) {
          setData(MOCK_DAILY_MONITORING);
        } else {
          const res = await api.get('/api/admin/monitoring/daily');
          setData(res.data);
        }
      } catch (err) {
        setData(MOCK_DAILY_MONITORING);
      } finally {
        setLoading(false);
      }
    }
    fetchMonitoring();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading monitoring data...</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold">⚡</div>
          <h1 className="text-xl font-bold">SurakshPay Router Admin</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white flex items-center">
            Merchant View →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Government Monitoring Dashboard</h2>
            <p className="text-gray-500">
              Live MDR compliance overview. Regulatory monitoring begins {data.government_monitoring_active ? '✅ ACTIVE' : 'Oct 15, 2026'}.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Date: {data.monitoring_date}</p>
          </div>
        </div>

        {/* Regulatory Notice Banner */}
        <div className={`mb-8 p-4 rounded-lg flex items-start gap-3 ${
          data.compliance_summary.unresolved_alerts > 0 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {data.compliance_summary.unresolved_alerts > 0 ? (
            <AlertTriangle className="text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="text-emerald-500 shrink-0" />
          )}
          <div className="text-sm font-medium pt-0.5">
            {data.regulatory_notice}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Daily Volume</h3>
            <p className="text-2xl font-bold text-gray-900">{formatINRCompact(data.transaction_summary.total_volume_paise)}</p>
            <p className="text-xs text-gray-400 mt-1">{data.transaction_summary.total_transactions.toLocaleString('en-IN')} transactions</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total MDR Collected</h3>
            <p className="text-2xl font-bold text-slate-700">{formatINR(data.transaction_summary.total_mdr_collected_paise)}</p>
            <p className="text-xs text-gray-400 mt-1">Paid to acquirers</p>
          </div>

          <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm bg-gradient-to-br from-white to-emerald-50">
            <h3 className="text-sm font-medium text-emerald-700 mb-1">Total MDR Saved</h3>
            <p className="text-2xl font-bold text-emerald-700">{formatINR(data.transaction_summary.total_mdr_saved_paise)}</p>
            <p className="text-xs text-emerald-600 mt-1">Vs standard 0.4% rate</p>
          </div>

          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm bg-gradient-to-br from-white to-red-50">
            <h3 className="text-sm font-medium text-red-700 mb-1">Active Compliance Alerts</h3>
            <p className="text-2xl font-bold text-red-700">{data.compliance_summary.unresolved_alerts}</p>
            <p className="text-xs text-red-600 mt-1">{data.compliance_summary.critical_alerts} critical</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* P2PM Approaching Limits */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-500" /> 
                P2PM Cap Warnings
              </h3>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium">
                {data.p2pm_health.count} merchants &gt; 90%
              </span>
            </div>
            <div className="p-0 flex-1">
              {data.p2pm_health.merchants_approaching_threshold.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {data.p2pm_health.merchants_approaching_threshold.map((m: any) => (
                    <li key={m.merchant_id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.merchant_id.substring(0,8)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600">{m.percent_of_cap}% of ₹1L cap</p>
                        <p className="text-xs text-gray-500">{m.consecutive_months} consecutive month(s)</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">No merchants approaching limits.</div>
              )}
            </div>
          </div>

          {/* Compliance Incident Monitor */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" /> 
                Compliance Incident Monitor
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Split Attempts Blocked</span>
                  <span className={`text-sm font-bold ${data.compliance_summary.split_attempts.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {data.compliance_summary.split_attempts.length} incidents
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">MDR Pass-through Detected</span>
                  <span className={`text-sm font-bold ${data.compliance_summary.mdr_pass_through_attempts.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {data.compliance_summary.mdr_pass_through_attempts.length} incidents
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-6 text-center">
                These incidents are automatically blocked by the Decision Engine. Admin review is recommended to warn repeat offenders.
              </p>
            </div>
          </div>

        </div>

        {/* Merchant Directory Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> 
              Registered Merchants
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search merchants..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                <tr>
                  <th className="px-6 py-3">Merchant Name</th>
                  <th className="px-6 py-3">Sub-Merchant ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Processed Volume</th>
                  <th className="px-6 py-3">Tx Count</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.merchants_list?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedMerchant(m)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{m.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatINR(m.volume_paise)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{m.tx_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1 w-full">
                        View <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Selected Merchant Overlay (Transaction History) */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedMerchant.name}</h2>
                <p className="text-sm text-slate-500 font-mono mt-0.5">ID: {selectedMerchant.id} • {selectedMerchant.email}</p>
              </div>
              <button 
                onClick={() => setSelectedMerchant(null)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Volume</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatINR(selectedMerchant.volume_paise)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transaction Count</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{selectedMerchant.tx_count}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Account Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="text-lg font-bold text-slate-900">{selectedMerchant.status}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Ledger Component */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <RecentTransactions transactions={MOCK_DASHBOARD.recent_transactions} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
