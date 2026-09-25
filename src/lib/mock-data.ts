// Mock data for frontend development without backend
// Set NEXT_PUBLIC_USE_MOCK=true to use these fixtures

export const MOCK_DASHBOARD = {
  merchant: {
    id: 'mock-b2b-001',
    name: 'TechFlow SaaS Solutions',
    p2pm_status: 'P2M_STANDARD',
    essential_sector: 'none',
    education_flag: false,
    capital_market_flag: false,
  },
  p2pm_health: {
    current_month_volume_paise: 450000000,  // ₹45,00,000 (clearly B2B, well above ₹1L)
    monthly_cap_paise: 10000000,            // ₹1,00,000
    percent_of_cap: 100.0,
    health_color: 'amber',
    consecutive_months_above_cap: 3,
    graduation_risk: false,
    graduation_warning: 'Your business is operating at B2B scale. You are correctly classified as standard P2M.'
  },
  mdr_summary: {
    total_mdr_charged_paise: 125000,        // ₹1,250
    total_mdr_saved_paise: 890000,          // ₹8,900
    transaction_count: 312,
  },
  route_breakdown: {
    VIRTUAL_ACCOUNT_IMPS:  { count: 145, volume_paise: 35000000 },
    UPI_AUTOPAY:           { count: 120, volume_paise: 18000000 },
    UPI_P2M:               { count: 47,  volume_paise: 8500000 },
  },
  recent_transactions: [
    { id: 't1', route: 'VIRTUAL_ACCOUNT_IMPS', amount_paise: 2500000, mdr_charged_paise: 1500, gst_on_mdr_paise: 270, savings_paise: 8500, status: 'COMPLETED', utr: 'CMS' + Math.floor(Math.random() * 1000000000).toString(), created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 't2', route: 'UPI_AUTOPAY', amount_paise: 1500000, mdr_charged_paise: 0, gst_on_mdr_paise: 0, savings_paise: 6000, status: 'COMPLETED', utr: 'CMS' + Math.floor(Math.random() * 1000000000).toString(), created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 't3', route: 'UPI_P2M', amount_paise: 550000, mdr_charged_paise: 2200, gst_on_mdr_paise: 396, savings_paise: 0, status: 'COMPLETED', utr: 'CMS' + Math.floor(Math.random() * 1000000000).toString(), created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 't4', route: 'VIRTUAL_ACCOUNT_IMPS', amount_paise: 7550000, mdr_charged_paise: 1500, gst_on_mdr_paise: 270, savings_paise: 28700, status: 'COMPLETED', utr: 'CMS' + Math.floor(Math.random() * 1000000000).toString(), created_at: new Date(Date.now() - 2592000000).toISOString() },
    { id: 't5', route: 'UPI_AUTOPAY', amount_paise: 1500000, mdr_charged_paise: 0, gst_on_mdr_paise: 0, savings_paise: 6000, status: 'COMPLETED', utr: 'CMS' + Math.floor(Math.random() * 1000000000).toString(), created_at: new Date(Date.now() - 5184000000).toISOString() },
  ],
};

export const MOCK_COMPLIANCE_ALERTS = {
  alerts: [
    { id: 'a1', merchant_id: 'mock-b2b-005', type: 'SPLIT_ATTEMPT', severity: 'CRITICAL', detail: 'Two ₹1,990 transactions detected in the same session within 5 minutes', resolved: false, created_at: new Date(Date.now() - 3600000).toISOString(), metadata: { session_id: 'sess-abc123' } },
    { id: 'a3', merchant_id: 'mock-b2b-002', type: 'RECONCILIATION_MISMATCH', severity: 'MEDIUM', detail: 'Settlement amount ₹9,950 does not match transaction amount ₹10,000', resolved: true, created_at: new Date(Date.now() - 2592000000).toISOString(), resolved_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  total: 2,
};

export const MOCK_DAILY_MONITORING = {
  monitoring_date: new Date().toISOString().split('T')[0],
  government_monitoring_active: false,
  transaction_summary: {
    total_transactions: 1245,
    total_volume_paise: 845000000,    // ₹84.5L
    total_mdr_collected_paise: 385000, // ₹3,850
    total_mdr_saved_paise: 1898000,    // ₹18,980
  },
  route_breakdown: [
    { route: 'VIRTUAL_ACCOUNT_IMPS',  count: 650,  volume_paise: 625000000 },
    { route: 'UPI_AUTOPAY',           count: 320,  volume_paise: 145000000 },
    { route: 'CAPITAL_MARKET',        count: 145,  volume_paise: 55000000 },
    { route: 'UPI_P2M',               count: 130,  volume_paise: 20000000 },
  ],

  compliance_summary: {
    total_alerts_today: 2,
    unresolved_alerts: 1,
    critical_alerts: 1,
    split_attempts: [],
    mdr_pass_through_attempts: [],
  },
  p2pm_health: {
    merchants_approaching_threshold: [
      { merchant_id: 'mock-005', name: 'Airtel Retailer', percent_of_cap: 94.5, consecutive_months: 2 },
    ],
    count: 1,
  },
  regulatory_notice: 'All clear. No compliance violations detected today.',
};

// Inject merchants list onto MOCK_DAILY_MONITORING
(MOCK_DAILY_MONITORING as any).merchants_list = [
  { id: 'acc_Rajesh001', name: 'Rajesh Electronics', email: 'rajesh@example.com', volume_paise: 45000000, tx_count: 142, status: 'ACTIVE', joined: '2026-05-12' },
  { id: 'acc_Sharma002', name: 'Sharma Jewellers', email: 'sharma@example.com', volume_paise: 89000000, tx_count: 56, status: 'ACTIVE', joined: '2026-06-01' },
  { id: 'acc_Tech003', name: 'Global Tech Corp', email: 'billing@globaltech.com', volume_paise: 12000000, tx_count: 89, status: 'WARNING', joined: '2026-08-15' },
  { id: 'acc_Cafe004', name: 'Metro Cafe & Roasters', email: 'hello@metrocafe.in', volume_paise: 450000, tx_count: 312, status: 'ACTIVE', joined: '2026-09-02' }
];
