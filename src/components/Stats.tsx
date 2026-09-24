import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid
} from 'recharts';
import { Transaction, Category } from '../types';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';

interface StatsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
}

export const Stats: React.FC<StatsProps> = ({ transactions, categories, currency }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const overviewData = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return [
      { name: 'Pemasukan', value: income, color: '#10b981' },
      { name: 'Pengeluaran', value: expense, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(tx => {
      const cat = categories.find(c => c.id === tx.categoryId);
      const name = cat?.name || 'Lainnya';
      categoryTotals[name] = (categoryTotals[name] || 0) + tx.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ 
        name, 
        value,
        color: categories.find(c => c.name === name)?.color || '#334155'
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="bg-slate-900 p-8 rounded-[3rem] mb-6 border border-slate-800 shadow-inner">
          <PieChartIcon size={48} className="opacity-20" />
        </div>
        <p className="font-bold text-sm uppercase tracking-widest opacity-40">Belum ada data untuk laporan</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
      <header>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Laporan Visual</h3>
        <h2 className="text-2xl font-black text-white">Analisa Keuangan</h2>
      </header>

      {/* Ringkasan Pie Chart */}
      <section className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <PieChartIcon size={18} />
          </div>
          <h4 className="font-bold text-slate-200">Perbandingan Arus Kas</h4>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overviewData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {overviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {overviewData.map((item) => (
            <div key={item.name} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
              </div>
              <p className="font-bold text-slate-200">{formatCurrency(item.value)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pengeluaran per Kategori */}
      {categoryData.length > 0 && (
        <section className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
              <TrendingDown size={18} />
            </div>
            <h4 className="font-bold text-slate-200">Pengeluaran per Kategori</h4>
          </div>

          <div className="space-y-6">
            {categoryData.map((item) => {
              const maxVal = categoryData[0].value;
              const percentage = (item.value / maxVal) * 100;
              
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-300">{item.name}</span>
                    <span className="text-xs font-black text-slate-500">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Insight Sederhana */}
      <section className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem]">
        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Insight Keuangan</h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          {overviewData.length === 2 && overviewData[1].value > overviewData[0].value 
            ? "Pengeluaran Anda lebih besar dari pemasukan bulan ini. Cobalah untuk meninjau kembali kategori pengeluaran terbesar Anda."
            : "Arus kas Anda terlihat sehat. Teruskan kebiasaan mencatat transaksi untuk perencanaan masa depan yang lebih baik."}
        </p>
      </section>
    </div>
  );
};
