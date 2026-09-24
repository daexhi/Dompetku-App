export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface UserProfile {
  currency: string;
  displayName?: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  tenor: number; // in months
  currentPeriod: number; // progress (e.g. month 5 of 12)
  startDate: string;
  createdAt: string;
}

export interface Budget {
  categoryId: string;
  percentage: number; // percentage of total balance
}
