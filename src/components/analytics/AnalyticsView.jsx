import React from 'react';
import { BarChart3, CheckCircle, Clock, AlertTriangle, TrendingUp, Award, Layers } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../../constants/taskConstants';

export function AnalyticsView({ tasks, stats }) {
  const { total, completed, pending, rate, byCategory, byPriority } = stats;

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <BarChart3 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Análises de Produtividade
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Acompanhe seu desempenho e a distribuição das suas tarefas em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Cartões de Indicadores Chave (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
            <p className="text-2xl font-black text-slate-900">{total}</p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pendentes</span>
            <p className="text-2xl font-black text-amber-700">{pending}</p>
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Concluídas</span>
            <p className="text-2xl font-black text-emerald-700">{completed}</p>
          </div>
        </div>

        {/* Taxa de Eficiência */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taxa de Conclusão</span>
            <p className="text-2xl font-black text-indigo-700">{rate}%</p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Progresso Geral da Lista
          </span>
          <span className="text-sm font-black text-indigo-600">{rate}% Concluído</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* Gráficos de Distribuição */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>Distribuição por Categoria</span>
          </h3>
          <div className="space-y-4">
            {Object.values(CATEGORIES).map((cat) => {
              const count = byCategory[cat.id] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                      {cat.display}
                    </span>
                    <span className="text-slate-500">
                      {count} {count === 1 ? 'tarefa' : 'tarefas'} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: cat.accent
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Prioridade */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>Distribuição por Prioridade</span>
          </h3>
          <div className="space-y-4">
            {Object.values(PRIORITIES).map((p) => {
              const count = byPriority[p.id] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              const colorMap = {
                Alta: 'bg-rose-500',
                Média: 'bg-amber-500',
                Baixa: 'bg-sky-500'
              };
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                      {p.display}
                    </span>
                    <span className="text-slate-500">
                      {count} {count === 1 ? 'tarefa' : 'tarefas'} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${colorMap[p.id] || 'bg-indigo-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
