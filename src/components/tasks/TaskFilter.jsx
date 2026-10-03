import React from 'react';
import { ListFilter, Clock, CheckCircle2, Layers } from 'lucide-react';

export function TaskFilter({ activeFilter, onFilterChange, counts }) {
  const filters = [
    { id: 'todas', label: 'Todas', icon: Layers, count: counts.total },
    { id: 'pendentes', label: 'Pendentes', icon: Clock, count: counts.pending },
    { id: 'concluidas', label: 'Concluídas', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl w-full sm:w-auto">
      {filters.map((f) => {
        const Icon = f.icon;
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
            <span>{f.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
