/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { TransactionDetail } from './components/TransactionDetail';
import { CategorySettings } from './components/CategorySettings';
import { DebtManager } from './components/DebtManager';
import { BudgetManager } from './components/BudgetManager';
import { Stats } from './components/Stats';
import { DEFAULT_CATEGORIES } from './constants/categories';
import { Category, Transaction, UserProfile, Debt, Budget } from './types';
import { Plus, Download, Settings as SettingsIcon, Upload } from 'lucide-react';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { exportToExcel, importFromExcel } from './lib/excel';

const TIMEZONE = 'Asia/Jakarta';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  // Date filtering state
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState(() => {
    const zonedNow = toZonedTime(new Date(), TIMEZONE);
    return formatTz(zonedNow, 'yyyy-MM-dd', { timeZone: TIMEZONE });
  });

  const [profile] = useState<UserProfile>({
    currency: 'IDR',
    createdAt: new Date().toISOString(),
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ show: true, title, message, onConfirm });
  };

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('alif_cashflow_data_v1');
    if (saved) {
      try {
        const { txs, cats, debts: savedDebts, budgets: savedBudgets } = JSON.parse(saved);
        setTransactions(txs || []);
        setCategories(cats || DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` })));
        setDebts(savedDebts || []);
        setBudgets(savedBudgets || []);
      } catch (err) {
        console.error('Error parsing saved data', err);
        setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` })));
      }
    } else {
      setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` })));
    }
    // Small delay to ensure state is settled
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded && categories.length > 0) {
      const data = JSON.stringify({ 
        txs: transactions, 
        cats: categories,
        debts,
        budgets
      });
      localStorage.setItem('alif_cashflow_data_v1', data);
    }
  }, [transactions, categories, debts, budgets, isLoaded]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = parseISO(tx.date);
      const zonedTxDate = toZonedTime(txDate, TIMEZONE);
      
      if (dateFilter === 'today') return isToday(zonedTxDate);
      if (dateFilter === 'yesterday') return isYesterday(zonedTxDate);
      if (dateFilter === 'custom') {
        const selected = customDate;
        return formatTz(zonedTxDate, 'yyyy-MM-dd', { timeZone: TIMEZONE }) === selected;
      }
      return true; // 'all'
    });
  }, [transactions, dateFilter, customDate]);

  const handleAddDebt = (data: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const handleDeleteDebt = (id: string) => {
    showConfirm('Hapus Hutang', 'Hapus data hutang ini?', () => {
      setDebts(prev => prev.filter(d => d.id !== id));
    });
  };

  const handleUpdateBudget = (categoryId: string, percentage: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.categoryId === categoryId);
      if (existing) {
        return prev.map(b => b.categoryId === categoryId ? { ...b, percentage } : b);
      }
      return [...prev, { categoryId, percentage }];
    });
  };

  const handleAddTransaction = (data: any) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...data } : t));
      setEditingTransaction(undefined);
    } else {
      const now = new Date();
      const zonedNow = toZonedTime(now, TIMEZONE);
      
      const newTx: Transaction = {
        ...data,
        id: crypto.randomUUID(),
        date: data.date || zonedNow.toISOString(),
        createdAt: zonedNow.toISOString(),
      };
      setTransactions(prev => [newTx, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (selectedTransaction?.id === id) {
      setSelectedTransaction(undefined);
    }
  };

  const confirmDeleteTransaction = (id: string) => {
    showConfirm('Hapus Transaksi', 'Hapus transaksi ini?', () => {
      handleDeleteTransaction(id);
    });
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
    setSelectedTransaction(undefined);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importFromExcel(file, categories);
        setTransactions(prev => [...imported, ...prev]);
        alert(`Berhasil mengimpor ${imported.length} transaksi!`);
      } catch (err) {
        alert('Gagal mengimpor file. Pastikan format sesuai.');
        console.error(err);
      }
    }
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = transactions
    .reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : -curr.amount), 0);

  const monthlyDebtPayment = debts.reduce((acc, curr) => acc + (curr.amount / curr.tenor), 0);

  const confirmDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    showConfirm('Hapus Kategori', `Hapus kategori "${cat?.name || 'ini'}"?`, () => {
      setCategories(prev => prev.filter(c => c.id !== id));
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 pb-32">
            <Dashboard 
              balance={balance} 
              income={totalIncome} 
              expense={totalExpense} 
              currency={profile.currency}
              monthlyDebtPayment={monthlyDebtPayment}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              customDate={customDate}
              onCustomDateChange={setCustomDate}
            />
            <TransactionList 
              transactions={filteredTransactions} 
              categories={categories} 
              currency={profile.currency}
              onEdit={handleEditTransaction}
              onDelete={confirmDeleteTransaction}
              onSelect={setSelectedTransaction}
            />
          </div>
        );
      case 'stats':
        return (
          <div className="pb-32">
            <Stats 
              transactions={transactions} 
              categories={categories} 
              currency={profile.currency} 
            />
          </div>
        );
      case 'budget':
        return (
          <div className="pb-32">
            <BudgetManager 
              categories={categories} 
              budgets={budgets} 
              onUpdate={handleUpdateBudget}
              balance={balance}
              currency={profile.currency}
            />
          </div>
        );
      case 'debt':
        return (
          <div className="pb-32">
            <DebtManager 
              debts={debts} 
              onAdd={handleAddDebt} 
              onDelete={handleDeleteDebt}
              currency={profile.currency}
            />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 pb-40">
            <h3 className="text-xl font-bold text-slate-100">Pengaturan</h3>
            
            <CategorySettings 
              categories={categories} 
              onAdd={(cat) => setCategories([...categories, { ...cat, id: crypto.randomUUID() }])} 
              onDelete={confirmDeleteCategory} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Ekspor</h4>
                <button
                  onClick={() => exportToExcel(transactions, categories)}
                  className="w-full flex flex-col items-center justify-center gap-2 py-6 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold rounded-3xl transition-all border border-emerald-500/20 shadow-lg"
                >
                  <Download size={24} />
                  <span className="text-[10px] uppercase">Excel</span>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Impor</h4>
                <label className="w-full flex flex-col items-center justify-center gap-2 py-6 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold rounded-3xl transition-all border border-blue-500/20 shadow-lg cursor-pointer">
                  <Upload size={24} />
                  <span className="text-[10px] uppercase">Upload</span>
                  <input type="file" accept=".xlsx" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Informasi</h4>
              <div className="bg-slate-800/50 rounded-3xl border border-slate-700/50 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-400">Mata Uang</span>
                  <span className="font-bold text-blue-400">{profile.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-400">Waktu Sistem</span>
                  <span className="font-bold text-slate-300">WIB (GMT+7)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                showConfirm('Hapus Semua', 'Hapus semua transaksi? Tindakan ini tidak dapat dibatalkan.', () => {
                  setTransactions([]);
                });
              }}
              className="w-full py-5 text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 rounded-[2rem] transition-all active:scale-[0.98] border border-red-500/20 shadow-lg shadow-red-900/10"
            >
              Hapus Semua Transaksi
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-900/50 pb-safe">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-slate-800/50">
        <div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Personal CashFlow</p>
          <h1 className="text-xl font-bold text-white tracking-tight">Alif CashFlow</h1>
        </div>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`p-2.5 rounded-2xl shadow-lg border active:scale-95 transition-all ${
            activeTab === 'settings' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      <main className="px-6 pt-6">
        {renderContent()}
      </main>

      {isFormOpen && (
        <TransactionForm 
          categories={categories} 
          transaction={editingTransaction}
          onSubmit={handleAddTransaction} 
          onClose={() => {
            setIsFormOpen(false);
            setEditingTransaction(undefined);
          }} 
        />
      )}

      {selectedTransaction && (
        <TransactionDetail 
          transaction={selectedTransaction}
          categories={categories}
          currency={profile.currency}
          onClose={() => setSelectedTransaction(undefined)}
          onEdit={handleEditTransaction}
          onDelete={confirmDeleteTransaction}
        />
      )}

      {confirmConfig.show && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setConfirmConfig(prev => ({ ...prev, show: false }))} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 transform scale-100 opacity-100">
            <h3 className="text-xl font-black text-white mb-2">{confirmConfig.title}</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">{confirmConfig.message}</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
                className="py-4 bg-slate-800 rounded-2xl font-bold text-slate-300 active:scale-95 transition-all border border-slate-700"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(prev => ({ ...prev, show: false }));
                }}
                className="py-4 bg-rose-600 rounded-2xl font-bold text-white shadow-lg shadow-rose-900/40 active:scale-95 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'add') {
            setEditingTransaction(undefined);
            setIsFormOpen(true);
          } else {
            setActiveTab(tab);
          }
        }} 
      />
    </div>
  );
}
