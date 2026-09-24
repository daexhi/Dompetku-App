import { Category } from '../types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Makanan', icon: 'Utensils', color: '#ef4444', type: 'expense' },
  { name: 'Transportasi', icon: 'Car', color: '#f59e0b', type: 'expense' },
  { name: 'Belanja', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
  { name: 'Hiburan', icon: 'Gamepad2', color: '#8b5cf6', type: 'expense' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: '#10b981', type: 'expense' },
  { name: 'Gaji', icon: 'Wallet', color: '#22c55e', type: 'income' },
  { name: 'Bonus', icon: 'TrendingUp', color: '#3b82f6', type: 'income' },
  { name: 'Investasi', icon: 'PieChart', color: '#6366f1', type: 'income' },
];
