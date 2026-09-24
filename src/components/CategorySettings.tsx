import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import { Plus, Trash2, Tag } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../lib/utils';

interface CategorySettingsProps {
  categories: Category[];
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
const ICONS = ['Utensils', 'Car', 'ShoppingBag', 'Gamepad2', 'HeartPulse', 'Wallet', 'TrendingUp', 'PieChart', 'Coffee', 'Gift', 'Home', 'Smartphone'];

export const CategorySettings: React.FC<CategorySettingsProps> = ({ categories, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [newIcon, setNewIcon] = useState(ICONS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({
      name: newName,
      type: newType,
      color: newColor,
      icon: newIcon,
    });
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kategori</h4>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-800 rounded-3xl border border-blue-500/30 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="space-y-4">
            <div className="flex p-1 bg-slate-900 rounded-2xl">
              <button
                onClick={() => setNewType('expense')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all",
                  newType === 'expense' ? "bg-slate-800 text-red-400 shadow-sm" : "text-slate-500"
                )}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setNewType('income')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all",
                  newType === 'income' ? "bg-slate-800 text-green-400 shadow-sm" : "text-slate-500"
                )}
              >
                Pemasukan
              </button>
            </div>

            <input
              type="text"
              placeholder="Nama Kategori..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Pilih Warna</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all border-2",
                      newColor === c ? "border-white scale-110 shadow-lg" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Pilih Ikon</label>
              <div className="flex flex-wrap gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
                {ICONS.map(iconName => {
                  const Icon = (LucideIcons as any)[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => setNewIcon(iconName)}
                      className={cn(
                        "p-2 rounded-xl transition-all",
                        newIcon === iconName ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-800"
                      )}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 py-4 bg-slate-700 rounded-2xl font-bold text-slate-300 active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map(cat => {
          const Icon = (LucideIcons as any)[cat.icon] || Tag;
          return (
            <div key={cat.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30">
              <div 
                className="p-3 rounded-2xl text-white shadow-lg shadow-black/20"
                style={{ backgroundColor: cat.color }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-200">{cat.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  {cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </p>
              </div>
              <button 
                onClick={() => onDelete(cat.id)}
                className="p-3 text-slate-600 hover:text-rose-400 transition-all active:scale-90 hover:bg-rose-500/10 rounded-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
