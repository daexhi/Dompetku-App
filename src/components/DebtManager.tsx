import React, { useState } from 'react';
import { Debt } from '../types';
import { Plus, Trash2, Calendar, CreditCard } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface DebtManagerProps {
  debts: Debt[];
  onAdd: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  onUpdate: (debt: Debt) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export const DebtManager: React.FC<DebtManagerProps> = ({ debts, onAdd, onUpdate, onDelete, currency }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    tenor: 1,
    currentPeriod: 1,
    monthlyInstallment: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.amount <= 0) return;
    
    if (editingId) {
      const existingDebt = debts.find(d => d.id === editingId);
      if (existingDebt) {
        onUpdate({
          ...existingDebt,
          ...formData
        });
      }
      setEditingId(null);
    } else {
      onAdd(formData);
    }

    setFormData({ 
      name: '', 
      amount: 0, 
      tenor: 1, 
      currentPeriod: 1, 
      monthlyInstallment: 0,
      startDate: format(new Date(), 'yyyy-MM-dd') 
    });
    setIsAdding(false);
  };

  const handleEdit = (debt: Debt) => {
    setFormData({
      name: debt.name,
      amount: debt.amount,
      tenor: debt.tenor,
      currentPeriod: debt.currentPeriod,
      monthlyInstallment: debt.monthlyInstallment,
      startDate: debt.startDate
    });
    setEditingId(debt.id);
    setIsAdding(true);
  };

  const handlePay = (debt: Debt) => {
    if (debt.amount <= 0 || debt.tenor <= 0) return;
    
    const newAmount = Math.max(0, debt.amount - debt.monthlyInstallment);
    const newTenor = Math.max(0, debt.tenor - 1);
    const newPeriod = debt.currentPeriod + 1;

    onUpdate({
      ...debt,
      amount: newAmount,
      tenor: newTenor,
      currentPeriod: newPeriod
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xl font-bold text-slate-100">Daftar Hutang</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-600 rounded-xl text-white active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

        {isAdding && (
        <form onSubmit={handleSubmit} className="bg-black p-6 rounded-3xl border border-slate-900 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase px-1">Nama Hutang</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Mis: Hutang Shopee"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase px-1">Total Pinjaman</label>
            <input
              type="number"
              required
              value={formData.amount || ''}
              onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold"
              placeholder="0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase px-1">Cicilan / Bulan</label>
            <input
              type="number"
              required
              value={formData.monthlyInstallment || ''}
              onChange={e => setFormData({ ...formData, monthlyInstallment: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-rose-400"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">Tenor (Bulan)</label>
              <div className="relative">
                <select
                  value={formData.tenor}
                  onChange={e => {
                    const newTenor = parseInt(e.target.value);
                    setFormData(prev => ({ 
                      ...prev, 
                      tenor: newTenor,
                      currentPeriod: Math.min(prev.currentPeriod, newTenor)
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none text-slate-200 font-bold"
                >
                  {Array.from({ length: 36 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m} Bulan</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <LucideIcons.ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">Tenor Berjalan Ke</label>
              <div className="relative">
                <select
                  value={formData.currentPeriod}
                  onChange={e => setFormData({ ...formData, currentPeriod: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none text-slate-200 font-bold"
                >
                  <option value={0}>Baru Cair (Bulan ke-0)</option>
                  {Array.from({ length: 36 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Bulan ke-{m}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <LucideIcons.ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase px-1">Tanggal Mulai</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-900/20"
          >
            {editingId ? 'Perbarui Hutang' : 'Simpan Hutang'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {debts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 italic">Belum ada catatan hutang</div>
        ) : (
          debts.map(debt => {
            const remainingMonths = debt.tenor;
            const progress = debt.tenor > 0 ? (debt.currentPeriod / (debt.currentPeriod + debt.tenor)) * 100 : 100;
            
            return (
              <div key={debt.id} className="bg-slate-900/10 border border-slate-900 rounded-3xl p-5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-red-500/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{debt.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Calendar size={10} />
                        <span>Mulai: {format(new Date(debt.startDate), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {remainingMonths > 0 && (
                      <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Pembayaran Bulan Ini</span>
                      </div>
                    )}
                    <button
                      onClick={() => onDelete(debt.id)}
                      className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Pinjaman</p>
                    <p className="font-bold text-slate-200">{formatCurrency(debt.amount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sisa Tenor</p>
                    <p className="font-bold text-slate-200">{debt.tenor} Bulan</p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-slate-900 mb-4 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cicilan / Bulan</span>
                  <span className="font-black text-rose-400">{formatCurrency(debt.monthlyInstallment)}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-slate-500">Progress Tenor</span>
                    <span className="text-blue-400">
                      {debt.currentPeriod === 0 ? 'Baru Cair' : `Bulan ke-${debt.currentPeriod}`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold text-right">
                    Sisa: <span className="text-emerald-400">{remainingMonths} Bulan Lagi</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEdit(debt)}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                  >
                    <LucideIcons.Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handlePay(debt)}
                    disabled={debt.amount <= 0}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:grayscale"
                  >
                    <LucideIcons.CheckCircle2 size={14} />
                    Bayar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
