import { createClient } from '@/lib/supabase/client';

export interface FinancialNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  body: string;
  amount?: number;
  currency?: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  priority: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Payment {
  id: string;
  reference: string;
  user_id?: string;
  organization_id?: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  provider?: string;
  description?: string;
  processed_at?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id?: string;
  organization_id?: string;
  plan: string;
  status: string;
  billing_cycle: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at?: string;
  created_at: string;
}

export interface Commission {
  id: string;
  ambassador_id?: string;
  payment_id?: string;
  commission_type: string;
  rate: number;
  base_amount: number;
  commission_amount: number;
  currency: string;
  status: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface Settlement {
  id: string;
  reference: string;
  organization_id?: string;
  settlement_type: string;
  gross_amount: number;
  platform_fee: number;
  tax_withheld: number;
  net_amount: number;
  currency: string;
  status: string;
  period_start?: string;
  period_end?: string;
  transaction_count: number;
  settled_at?: string;
  created_at: string;
}

export interface TaxRecord {
  id: string;
  organization_id?: string;
  tax_type: string;
  tax_rate: number;
  taxable_amount: number;
  tax_amount: number;
  currency: string;
  country_code: string;
  period_start?: string;
  period_end?: string;
  status: string;
  filed_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface RevenueReconciliation {
  id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  subscription_revenue: number;
  payment_revenue: number;
  marketplace_revenue: number;
  api_revenue: number;
  other_revenue: number;
  total_refunds: number;
  total_commissions_paid: number;
  total_taxes_collected: number;
  net_revenue: number;
  currency: string;
  status: string;
  reconciled_at?: string;
  created_at: string;
}

export interface AmbassadorPayout {
  id: string;
  ambassador_id?: string;
  period_start: string;
  period_end: string;
  total_commissions: number;
  total_bonuses: number;
  deductions: number;
  net_payout: number;
  currency: string;
  status: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
}

export interface MarketplaceSettlement {
  id: string;
  seller_organization_id?: string;
  period_start: string;
  period_end: string;
  total_sales: number;
  platform_commission: number;
  tax_withheld: number;
  net_settlement: number;
  currency: string;
  order_count: number;
  status: string;
  settled_at?: string;
  created_at: string;
}

// ─── Financial Notifications ───────────────────────────────────────────────

export async function getFinancialNotifications(userId: string): Promise<FinancialNotification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('financial_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function markFinancialNotificationRead(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('financial_notifications')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllFinancialNotificationsRead(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('financial_notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
}

// ─── Payments ──────────────────────────────────────────────────────────────

export async function getPayments(limit = 20): Promise<Payment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── Subscriptions ─────────────────────────────────────────────────────────

export async function getSubscriptions(limit = 20): Promise<Subscription[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── Commissions ───────────────────────────────────────────────────────────

export async function getCommissions(limit = 20): Promise<Commission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getCommissionsByAmbassador(ambassadorId: string): Promise<Commission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('ambassador_id', ambassadorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── Settlements ───────────────────────────────────────────────────────────

export async function getSettlements(limit = 20): Promise<Settlement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('settlements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ─── Tax Records ───────────────────────────────────────────────────────────

export async function getTaxRecords(limit = 20): Promise<TaxRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tax_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ─── Revenue Reconciliation ────────────────────────────────────────────────

export async function getRevenueReconciliation(): Promise<RevenueReconciliation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('revenue_reconciliation')
    .select('*')
    .order('period_start', { ascending: false })
    .limit(12);
  if (error) throw error;
  return data || [];
}

// ─── Ambassador Payouts ────────────────────────────────────────────────────

export async function getAmbassadorPayouts(limit = 20): Promise<AmbassadorPayout[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ambassador_payouts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ─── Marketplace Settlements ───────────────────────────────────────────────

export async function getMarketplaceSettlements(limit = 20): Promise<MarketplaceSettlement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('marketplace_settlements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ─── Admin Analytics Aggregates ────────────────────────────────────────────

export interface AdminFinancialSummary {
  totalMRR: number;
  totalTransactionVolume: number;
  pendingSettlements: number;
  totalTaxCollected: number;
  totalCommissionsPaid: number;
  activeSubscriptions: number;
  failedPayments: number;
  currency: string;
}

export async function getAdminFinancialSummary(): Promise<AdminFinancialSummary> {
  const supabase = createClient();

  const [subRes, payRes, settleRes, taxRes, commRes] = await Promise.all([
    supabase.from('subscriptions').select('amount, status, currency'),
    supabase.from('payments').select('amount, status, currency, created_at').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('settlements').select('net_amount, status, currency'),
    supabase.from('tax_records').select('tax_amount, status, currency'),
    supabase.from('commissions').select('commission_amount, status, currency'),
  ]);

  const subscriptions = subRes.data || [];
  const payments = payRes.data || [];
  const settlements = settleRes.data || [];
  const taxRecords = taxRes.data || [];
  const commissions = commRes.data || [];

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalTransactionVolume = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingSettlements = settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.net_amount || 0), 0);
  const totalTaxCollected = taxRecords.filter(t => t.status === 'paid').reduce((sum, t) => sum + (t.tax_amount || 0), 0);
  const totalCommissionsPaid = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  return {
    totalMRR,
    totalTransactionVolume,
    pendingSettlements,
    totalTaxCollected,
    totalCommissionsPaid,
    activeSubscriptions: activeSubscriptions.length,
    failedPayments,
    currency: 'XOF',
  };
}
