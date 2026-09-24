import React from 'react';
import { Category, Budget } from '../types';
import * as LucideIcons from 'lucide-react';

interface BudgetManagerProps {
  categories: Category[];
  budgets: Budget[];
  onUpdate: (categoryId: string, percentage: number) => void;
  balance: number;
  currency: string;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ categories, budgets, onUpdate, balance, currency }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const totalAllocated = budgets.reduce((acc, b) => {
    if (expenseCategories.find(c => c.id === b.categoryId)) {
      return acc + b.percentage;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h3 className="text-xl font-bold text-slate-100">Budgeting</h3>
        <p className="text-sm text-slate-500 mt-1">Atur budget berdasarkan persentase saldo saat ini</p>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800/50 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Saldo</p>
            <p className="text-xl font-black text-blue-400">{formatCurrency(balance)}</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
            <LucideIcons.PieChart size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">Total Alokasi</span>
            <span className={totalAllocated >= 100 ? "text-rose-400" : "text-emerald-400"}>
              {totalAllocated}% / 100%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className={`h-full transition-all duration-500 ${totalAllocated >= 100 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
              style={{ width: `${Math.min(totalAllocated, 100)}%` }}
            />
          </div>
          {totalAllocated >= 100 && (
            <p className="text-[9px] text-rose-400 font-bold uppercase tracking-tighter animate-pulse">
              Alokasi sudah mencapai batas maksimal!
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {expenseCategories.map(cat => {
          const budget = budgets.find(b => b.categoryId === cat.id) || { categoryId: cat.id, percentage: 0 };
          const budgetAmount = (balance * budget.percentage) / 100;
          const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.HelpCircle;

          // Calculate how much more can be allocated to this specific slider
          const totalOthers = totalAllocated - budget.percentage;
          const maxAllowed = 100 - totalOthers;

          return (
            <div key={cat.id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl transition-colors" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{cat.name}</h4>
                    <p className="text-xs font-bold text-slate-500">{budget.percentage}% dari saldo</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-100">{formatCurrency(budgetAmount)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Persentase Budget</span>
                  <span className={budget.percentage >= maxAllowed && maxAllowed < 100 ? "text-rose-400" : "text-blue-400"}>
                    {budget.percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxAllowed}
                  step="1"
                  value={budget.percentage}
                  onChange={e => onUpdate(cat.id, Math.min(parseInt(e.target.value), maxAllowed))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                  disabled={maxAllowed <= 0 && budget.percentage === 0}
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                  <span>0%</span>
                  <span>Maks: {maxAllowed}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
