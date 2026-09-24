import React from 'react';
import { Category, Transaction } from '../types';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { cn } from '../lib/utils';

const TIMEZONE = 'Asia/Jakarta';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
  onSelect?: (tx: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, currency, onEdit, onDelete, onSelect }) => {
  const getCategory = (id: string) => categories.find(c => c.id === id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-600">
        <div className="bg-slate-900 p-8 rounded-[3rem] mb-6 border border-slate-800 shadow-inner">
          <LucideIcons.Inbox size={48} className="opacity-20" />
        </div>
        <p className="font-bold text-sm uppercase tracking-widest opacity-40">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Daftar Transaksi</h3>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{transactions.length} Item</span>
      </div>
      <div className="space-y-4">
        {sortedTransactions.map((tx) => {
          const category = getCategory(tx.categoryId);
          const Icon = category ? (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle : LucideIcons.HelpCircle;
          
          // Format date with Jakarta timezone
          const zonedDate = toZonedTime(new Date(tx.date), TIMEZONE);
          
          return (
            <div 
              key={tx.id} 
              onClick={() => onSelect?.(tx)}
              className="group relative flex items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800/50 shadow-sm hover:bg-slate-900/60 transition-all cursor-pointer"
            >
              <div 
                className="p-3.5 rounded-[1.25rem] text-white shadow-xl shadow-black/20"
                style={{ backgroundColor: category?.color || '#334155' }}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">{category?.name || 'Lainnya'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">
                  {tx.description || format(zonedDate, 'dd MMMM yyyy', { locale: id })}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className={cn(
                  "font-black truncate",
                  tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400',
                  "text-[clamp(0.8rem,4vw,1rem)]"
                )}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">
                    {format(zonedDate, 'HH:mm')}
                  </p>
                  <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(tx); }}
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors bg-slate-800/50 sm:bg-transparent"
                    >
                      <LucideIcons.Pencil size={14} />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onDelete?.(tx.id);
                      }}
                      className="p-4 text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all active:scale-90 bg-slate-800/80 flex items-center justify-center min-w-[48px] min-h-[48px] border border-rose-500/20 shadow-lg"
                      aria-label="Hapus"
                    >
                      <LucideIcons.Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
