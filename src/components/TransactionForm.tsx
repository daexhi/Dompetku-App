import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category, TransactionType } from '../types';
import { cn } from '../lib/utils';
import * as LucideIcons from 'lucide-react';
import { toZonedTime, format as formatTz } from 'date-fns-tz';

const TIMEZONE = 'Asia/Jakarta';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  transaction?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onSubmit, onClose, transaction }) => {
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || '');
  const [description, setDescription] = useState(transaction?.description || '');
  
  // Default to Jakarta time
  const [date, setDate] = useState(() => {
    if (transaction) {
      const zonedDate = toZonedTime(new Date(transaction.date), TIMEZONE);
      return formatTz(zonedDate, 'yyyy-MM-dd', { timeZone: TIMEZONE });
    }
    const zonedNow = toZonedTime(new Date(), TIMEZONE);
    return formatTz(zonedNow, 'yyyy-MM-dd', { timeZone: TIMEZONE });
  });

  const [time, setTime] = useState(() => {
    if (transaction) {
      const zonedDate = toZonedTime(new Date(transaction.date), TIMEZONE);
      return formatTz(zonedDate, 'HH:mm', { timeZone: TIMEZONE });
    }
    const zonedNow = toZonedTime(new Date(), TIMEZONE);
    return formatTz(zonedNow, 'HH:mm', { timeZone: TIMEZONE });
  });

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    
    // Construct full ISO string for Jakarta time using selected date and time
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDate = new Date(date);
    selectedDate.setHours(hours, minutes, 0, 0);
    
    onSubmit({
      amount: parseFloat(amount),
      type,
      categoryId,
      description,
      date: selectedDate.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] overflow-y-auto pt-10 pb-10">
      <div className="min-h-full flex items-center justify-center p-0 sm:p-4">
        <div className="bg-black w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-900 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{transaction ? 'Edit Transaksi' : 'Catat Transaksi'}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Waktu: {TIMEZONE}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-900 rounded-2xl text-slate-400 active:scale-95 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                "flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest",
                type === 'expense' ? "bg-slate-800 text-rose-400 shadow-sm" : "text-slate-600"
              )}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                "flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest",
                type === 'income' ? "bg-slate-800 text-emerald-400 shadow-sm" : "text-slate-600"
              )}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Jumlah (Rp)</label>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-900 border border-slate-800 rounded-3xl py-6 px-6 text-4xl font-black text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Pilih Kategori</label>
            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1 scrollbar-hide">
              {filteredCategories.map((cat) => {
                const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.HelpCircle;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                      categoryId === cat.id 
                        ? "border-blue-500 bg-blue-500/10" 
                        : "border-transparent bg-slate-900 hover:bg-slate-800"
                    )}
                  >
                    <div 
                      className="p-3 rounded-2xl text-white shadow-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 leading-tight w-full text-center">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Waktu (Jam)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Catatan</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 active:scale-[0.98] transition-all"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};
