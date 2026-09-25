// ─────────────────────────────────────────────────────────────────────────────
// INR formatter using Indian number system (en-IN locale)
// ₹1,00,000 NOT ₹100,000
// ─────────────────────────────────────────────────────────────────────────────
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function formatINRCompact(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 10000000) return `₹${(rupees / 10000000).toFixed(1)}Cr`;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return formatINR(paise);
}

// Format IST timestamp
export function formatIST(date: string | Date): string {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Route display names and colors
export const ROUTE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  UPI_P2M:               { label: 'Standard UPI',       color: '#64748B', bgColor: 'bg-slate-100 text-slate-800' },
  UPI_P2PM:              { label: 'SurakshPay Optimized', color: '#10B981', bgColor: 'bg-emerald-100 text-emerald-800' },
  UPI_AUTOPAY:           { label: 'SurakshPay Auto',      color: '#14B8A6', bgColor: 'bg-teal-100 text-teal-800' },
  UPI_RUPAY_CC:          { label: 'Credit Card (UPI)',  color: '#F97316', bgColor: 'bg-orange-100 text-orange-800' },
  UPI_RUPAY_DEBIT:       { label: 'Standard UPI',       color: '#64748B', bgColor: 'bg-slate-100 text-slate-800' },
  VIRTUAL_ACCOUNT_IMPS:  { label: 'SurakshPay Direct',    color: '#059669', bgColor: 'bg-emerald-100 text-emerald-800' },
  ESSENTIAL_SECTOR_FLAT: { label: 'SurakshPay Essential', color: '#EAB308', bgColor: 'bg-yellow-100 text-yellow-800' },
  EDUCATION_CONCESSIONAL:{ label: 'SurakshPay Education', color: '#EC4899', bgColor: 'bg-pink-100 text-pink-800' },
  CAPITAL_MARKET:        { label: 'SurakshPay Markets',   color: '#3B82F6', bgColor: 'bg-blue-100 text-blue-800' },
};

export const P2PM_STATUS_CONFIG: Record<string, { label: string; bgColor: string }> = {
  P2PM_ACTIVE:  { label: 'P2PM Active',  bgColor: 'bg-green-100 text-green-800' },
  P2M_STANDARD: { label: 'Standard P2M', bgColor: 'bg-blue-100 text-blue-800' },
  PENDING:      { label: 'Pending',       bgColor: 'bg-yellow-100 text-yellow-800' },
};
