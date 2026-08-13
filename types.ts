
export interface SalesFunnel {
  prospects: number;
  leads: number;
  appointments: number;
  sales: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface RevenueStream {
  id: string;
  name: string;
  type: 'mrr' | 'one-time';
  value: number; // monthly amount for MRR, or avg deal size for one-time
  count: number; // current number of subscribers or deals per month
  funnel: SalesFunnel;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface FinancialStats {
  companyName: string;
  revenueStreams: RevenueStream[];
  expenses: Expense[];
  targetMonthlyIncome: number;
  compoundingRate: number; // Monthly percentage growth
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface ResearchLog {
  timestamp: string;
  action: string;
  finding: string;
  sources: GroundingSource[];
}

export interface SovereignState {
  currentGoal: string;
  status: 'idle' | 'researching' | 'planning' | 'executing';
  logs: ResearchLog[];
}
