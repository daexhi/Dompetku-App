import React from 'react';
import { X, Calendar, Clock, Tag, FileText, Pencil, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Category, Transaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Jakarta';

interface TransactionDetailProps {
  transaction: Transaction;
  categories: Category[];
  currency: string;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({ 
  transaction, 
  categories, 
  currency, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const category = categories.find(c => c.id === transaction.categoryId);
  const zonedDate = toZonedTime(new Date(transaction.date), TIMEZONE);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] overflow-y-auto pt-10 pb-10">
      <div className="min-h-full flex items-center justify-center p-0 sm:p-4">
        <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">Detail Transaksi</h2>
            <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl text-slate-400 active:scale-95 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center py-6 bg-slate-950/50 rounded-[2rem] border border-slate-800/50">
              <div 
                className="p-5 rounded-3xl text-white shadow-2xl mb-4"
                style={{ backgroundColor: category?.color || '#334155' }}
              >
                {category?.icon && React.createElement((LucideIcons as any)[category.icon] || Tag, { size: 32 })}
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{category?.name || 'Lainnya'}</p>
              <h3 className={transaction.type === 'income' ? 'text-4xl font-black text-emerald-400 mt-2' : 'text-4xl font-black text-rose-400 mt-2'}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <Calendar size={18} className="text-blue-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tanggal</p>
                  <p className="font-bold text-slate-200">{format(zonedDate, 'dd MMMM yyyy', { locale: id })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <Clock size={18} className="text-blue-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu</p>
                  <p className="font-bold text-slate-200">{format(zonedDate, 'HH:mm')} WIB</p>
                </div>
              </div>
              {transaction.description && (
                <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <FileText size={18} className="text-blue-500" />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catatan</p>
                    <p className="font-bold text-slate-200">{transaction.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => onEdit(transaction)}
                className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-4 rounded-2xl font-black uppercase tracking-widest border border-blue-500/20 transition-all"
              >
                <Pencil size={18} />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(transaction.id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 py-4 rounded-2xl font-black uppercase tracking-widest border border-rose-500/20 transition-all active:scale-95 min-h-[56px]"
              >
                <Trash2 size={18} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
