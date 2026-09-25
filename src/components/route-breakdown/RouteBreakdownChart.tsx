'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ROUTE_CONFIG, formatINR, formatINRCompact } from '@/lib/utils';

interface RouteBreakdownChartProps {
  route_breakdown: Record<string, { count: number; volume_paise: number }>;
}

/**
 * Route Breakdown Pie Chart
 * Shows distribution of transactions across all 9 routing paths.
 * Color-coded to match the ROUTE_CONFIG palette.
 */
export function RouteBreakdownChart({ route_breakdown }: RouteBreakdownChartProps) {
  const groupedData: Record<string, { name: string; value: number; volume_paise: number; color: string }> = {};

  Object.entries(route_breakdown)
    .filter(([, v]) => v.count > 0)
    .forEach(([route, stats]) => {
      const config = ROUTE_CONFIG[route] || { label: 'Standard UPI', color: '#64748B' };
      const label = config.label;
      if (!groupedData[label]) {
        groupedData[label] = { name: label, value: 0, volume_paise: 0, color: config.color };
      }
      groupedData[label].value += stats.count;
      groupedData[label].volume_paise += stats.volume_paise;
    });

  const data = Object.values(groupedData).sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);
  const totalVolume = data.reduce((s, d) => s + d.volume_paise, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-900">{d.name}</p>
        <p className="text-gray-600">{d.value} payments ({((d.value / total) * 100).toFixed(1)}%)</p>
        <p className="text-gray-600">Volume: {formatINR(d.volume_paise)}</p>
      </div>
    );
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {data.map(d => (
        <div key={d.name} className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
          <span className="text-gray-600 truncate">{d.name}</span>
          <span className="text-gray-400 ml-auto">{((d.value / total) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="metric-card flex items-center justify-center h-64">
        <p className="text-gray-400">No transactions this month</p>
      </div>
    );
  }

  return (
    <div className="metric-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Methods</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500">payments · {formatINRCompact(totalVolume)} total</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend />

      {/* Zero-MDR summary */}
      <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
        <p className="text-xs text-center text-emerald-800">
          <span className="font-bold">
            {Object.entries(route_breakdown)
              .filter(([route]) => ['UPI_P2M', 'UPI_P2PM', 'UPI_AUTOPAY', 'UPI_RUPAY_CC', 'UPI_RUPAY_DEBIT'].includes(route))
              .reduce((s, [, stats]) => s + stats.count, 0)
              .toLocaleString('en-IN')}
          </span> of {total.toLocaleString('en-IN')} payments ({
            Math.round(
              (Object.entries(route_breakdown)
                .filter(([route]) => ['UPI_P2M', 'UPI_P2PM', 'UPI_AUTOPAY', 'UPI_RUPAY_CC', 'UPI_RUPAY_DEBIT'].includes(route))
                .reduce((s, [, stats]) => s + stats.count, 0) / total) * 100
            )
          }%) processed with <span className="font-bold">zero fees</span>
        </p>
      </div>
    </div>
  );
}
