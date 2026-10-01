import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, CreditCard, Target, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'stats', label: 'Laporan', icon: PieChart },
    { id: 'add', label: 'Tambah', icon: Plus, isAction: true },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'debt', label: 'Hutang', icon: CreditCard },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100]">
      <nav className="bg-black/95 backdrop-blur-2xl border-t border-slate-900/50 px-2 pb-safe pt-2 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.6)] h-20 relative">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange('add')}
                className="flex flex-col items-center gap-1.5 py-2 px-1 transition-all active:scale-90 flex-1 min-w-0 mb-1 group"
              >
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-900/40 group-active:scale-95 transition-all">
                  <Plus size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600 group-active:text-blue-400">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl transition-all active:scale-90 flex-1 min-w-0 mb-1",
                isActive ? "text-blue-500" : "text-slate-500 hover:text-slate-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-blue-500/10" : "bg-transparent"
              )}>
                <Icon size={18} className={cn("transition-transform", isActive && "scale-110")} />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-tighter truncate w-full text-center leading-none",
                isActive ? "text-blue-400" : "text-slate-600"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
