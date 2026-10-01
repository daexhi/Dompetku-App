import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  balance: number;
  income: number;
  expense: number;
  currency: string;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  customDate: string;
  onCustomDateChange: (date: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  balance, 
  income, 
  expense, 
  currency, 
  dateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-1">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hari Ini</p>
          <div className="flex items-center gap-2 text-slate-200">
            <Calendar size={14} className="text-blue-500" />
            <span className="text-sm font-bold">{format(today, 'EEEE, dd MMMM yyyy', { locale: id })}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'today', label: 'Hari Ini' },
          { id: 'yesterday', label: 'Kemarin' },
          { id: 'custom', label: 'Pilih Tanggal' },
          { id: 'all', label: 'Semua' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => onDateFilterChange(f.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              dateFilter === f.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {dateFilter === 'custom' && (
        <input
          type="date"
          value={customDate}
          onChange={(e) => onCustomDateChange(e.target.value)}
          className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        />
      )}

      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="flex items-center gap-2 opacity-70 mb-2">
          <Wallet size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Total Saldo</span>
        </div>
        <h2 className="text-[clamp(1.1rem,10vw,2.5rem)] font-black mb-8 tracking-tight truncate leading-tight">
          {formatCurrency(balance)}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-md border border-white/10 overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
              <TrendingUp size={10} />
              <span className="text-[7px] font-black uppercase whitespace-nowrap">Pemasukan</span>
            </div>
            <p className="font-black text-[clamp(0.6rem,2.4vw,0.7rem)] truncate max-w-full leading-tight">{formatCurrency(income)}</p>
          </div>
          <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-md border border-white/10 overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5 text-rose-300 mb-1">
              <TrendingDown size={10} />
              <span className="text-[7px] font-black uppercase whitespace-nowrap">Pengeluaran</span>
            </div>
            <p className="font-black text-[clamp(0.6rem,2.4vw,0.7rem)] truncate max-w-full leading-tight">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/10 p-5 rounded-[2rem] border border-slate-900 shadow-sm min-w-0">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sisa Bulan Ini</p>
          <p className="text-[clamp(0.875rem,4.5vw,1.125rem)] font-bold text-slate-200 truncate">{formatCurrency(income - expense)}</p>
        </div>
        <div className="bg-slate-900/10 p-5 rounded-[2rem] border border-slate-900 shadow-sm min-w-0">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Rata Harian</p>
          <p className="text-[clamp(0.875rem,4.5vw,1.125rem)] font-bold text-slate-200 truncate">{formatCurrency(expense / 30)}</p>
        </div>
      </div>
    </div>
  );
};
