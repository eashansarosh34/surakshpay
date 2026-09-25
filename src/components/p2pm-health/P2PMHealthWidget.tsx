'use client';

import { formatINR, formatINRCompact } from '@/lib/utils';

interface P2PMHealthWidgetProps {
  current_month_volume_paise: number;
  monthly_cap_paise: number;
  percent_of_cap: number;
  health_color: 'green' | 'amber' | 'red';
  consecutive_months_above_cap: number;
  graduation_risk?: boolean;
  graduation_warning?: string | null;
}

const COLOR_MAP = {
  green: {
    ring: '#10B981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    emoji: '🟢',
    label: 'Healthy',
  },
  amber: {
    ring: '#F59E0B',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    emoji: '🟡',
    label: 'Approaching Limit',
  },
  red: {
    ring: '#EF4444',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    emoji: '🔴',
    label: 'Near Graduation',
  },
  neutral: {
    ring: '#6B7280',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    emoji: '🏢',
    label: 'B2B Scale',
  }
};

/**
 * P2PM Health Widget
 *
 * Shows current month's UPI collection vs ₹1,00,000 P2PM cap.
 */
export function P2PMHealthWidget({
  current_month_volume_paise,
  monthly_cap_paise,
  percent_of_cap,
  health_color,
  consecutive_months_above_cap,
  graduation_risk,
  graduation_warning,
}: P2PMHealthWidgetProps) {
  const colors = COLOR_MAP[health_color === 'amber' && percent_of_cap > 150 ? 'neutral' : (health_color as keyof typeof COLOR_MAP) || 'neutral'];
  const clampedPct = Math.min(percent_of_cap, 100);

  // SVG circular progress ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className={`metric-card ${colors.bg} ${colors.border} border-2`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Free UPI Limit
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatINR(current_month_volume_paise)}
            <span className="text-base font-normal text-gray-500 ml-1">
              / {formatINR(monthly_cap_paise)}
            </span>
          </p>
        </div>
        <span className={`badge ${colors.bg} ${colors.text} border ${colors.border}`}>
          {colors.emoji} {colors.label}
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mb-6">
        {/* Circular progress ring */}
        <div className="flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none" stroke={colors.ring}
              strokeWidth="10" strokeLinecap="round" strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={(2 * Math.PI * 50) - (clampedPct / 100) * (2 * Math.PI * 50)}
              transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <text x="60" y="56" textAnchor="middle" className="text-xl" fill={colors.ring} style={{ fontWeight: 'bold' }}>
              {Math.round(clampedPct)}%
            </text>
            <text x="60" y="74" textAnchor="middle" fill="#6B7280" style={{ fontSize: '10px' }}>
              of ₹1L free limit
            </text>
          </svg>
        </div>

        <div className="w-full">
          {/* Progress bar - Only show if not heavily exceeding cap */}
          {percent_of_cap <= 150 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{formatINRCompact(current_month_volume_paise)} used</span>
                <span>{formatINRCompact(Math.max(0, monthly_cap_paise - current_month_volume_paise))} remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ width: `${clampedPct}%`, backgroundColor: colors.ring }}
                />
              </div>
            </div>
          )}

          {/* Consecutive months indicator - only relevant if nearing or at limit */}
          {percent_of_cap >= 80 && percent_of_cap <= 300 && (
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Months over ₹1L limit:</span>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${n <= consecutive_months_above_cap ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zero MDR badge - Only show if green/healthy */}
          {colors.label === 'Healthy' && (
            <div className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium w-full text-center mt-2">
              <span>✅ Free UPI Active (Zero Fees)</span>
            </div>
          )}
        </div>
      </div>

      {/* Graduation warning / Info alert */}
      {(graduation_risk || graduation_warning) && (
        <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 border ${graduation_risk ? 'bg-red-100 border-red-300' : 'bg-blue-50 border-blue-200'}`}>
          <span className={`text-lg ${graduation_risk ? 'text-red-500' : 'text-blue-500'}`}>
            {graduation_risk ? '⚠️' : 'ℹ️'}
          </span>
          <div>
            <p className={`text-sm font-semibold ${graduation_risk ? 'text-red-700' : 'text-blue-800'}`}>
              {graduation_risk ? 'Account Limit Alert' : 'Account Status'}
            </p>
            <p className={`text-sm ${graduation_risk ? 'text-red-600' : 'text-blue-700'}`}>
              {graduation_warning ||
                'You are approaching your 3rd consecutive month above ₹1,00,000. Going over this limit means standard payment fees will apply.'}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        💡 Your business can process up to ₹1,00,000 in free UPI payments each month. Going consistently over this applies standard fees.
      </p>
    </div>
  );
}
