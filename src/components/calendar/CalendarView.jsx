import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { TaskItem } from '../tasks/TaskItem';

export function CalendarView({ tasks, onToggleTask, onEditTask, onDeleteTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Agrupamento temporal das tarefas
  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = [];
    const dueToday = [];
    const upcoming = [];
    const completed = [];

    tasks.forEach((task) => {
      if (task.completed) {
        completed.push(task);
        return;
      }

      if (!task.dueDate) {
        upcoming.push(task);
        return;
      }

      const [year, month, day] = task.dueDate.split('-');
      const taskDate = new Date(year, month - 1, day);
      taskDate.setHours(0, 0, 0, 0);

      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        overdue.push(task);
      } else if (diffDays === 0) {
        dueToday.push(task);
      } else {
        upcoming.push(task);
      }
    });

    // Ordenar próximas por data
    upcoming.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

    return { overdue, dueToday, upcoming, completed };
  }, [tasks]);

  // Calendário do mês atual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Tarefas por data YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        map[t.dueDate] = map[t.dueDate] || [];
        map[t.dueDate].push(t);
      }
    });
    return map;
  }, [tasks]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDayTasks = selectedDateStr ? (tasksByDate[selectedDateStr] || []) : null;

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Calendário de Vencimentos
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Visualize suas tarefas organizadas por data e planeje seus prazos com precisão.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel do Calendário Visual (5 colunas) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Grid dos dias */}
          <div className="grid grid-cols-7 gap-1">
            {/* Espaços vazios no início */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {/* Dias do mês */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayPadded = String(dayNum).padStart(2, '0');
              const monthPadded = String(month + 1).padStart(2, '0');
              const dateKey = `${year}-${monthPadded}-${dayPadded}`;
              
              const dayTasks = tasksByDate[dateKey] || [];
              const hasTasks = dayTasks.length > 0;
              const hasPending = dayTasks.some((t) => !t.completed);
              const isSelected = selectedDateStr === dateKey;

              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = dateKey === todayStr;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDateStr(isSelected ? '' : dateKey)}
                  className={`h-10 rounded-xl flex flex-col items-center justify-center relative text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isToday
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasTasks && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected
                          ? 'bg-white'
                          : hasPending
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDateStr && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Filtrando dia selecionado: <strong>{selectedDateStr.split('-').reverse().join('/')}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDateStr('')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Limpar filtro
              </button>
            </div>
          )}
        </div>

        {/* Lista de Prazos (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          
          {selectedDateStr ? (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Tarefas para {selectedDateStr.split('-').reverse().join('/')}
              </h3>
              {selectedDayTasks && selectedDayTasks.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedDayTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-6 text-center">
                  Nenhuma tarefa agendada para este dia.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Tarefas Atrasadas */}
              {groupedTasks.overdue.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Atrasadas ({groupedTasks.overdue.length})</span>
                  </div>
                  <div className="space-y-2.5">
                    {groupedTasks.overdue.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tarefas Para Hoje */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Para Hoje ({groupedTasks.dueToday.length})</span>
                </div>
                {groupedTasks.dueToday.length > 0 ? (
                  <div className="space-y-2.5">
                    {groupedTasks.dueToday.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-sm text-slate-500 text-center">
                    Nenhuma tarefa com vencimento para hoje.
                  </div>
                )}
              </div>

              {/* Próximas Tarefas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <span>Próximas Tarefas ({groupedTasks.upcoming.length})</span>
                </div>
                {groupedTasks.upcoming.length > 0 ? (
                  <div className="space-y-2.5">
                    {groupedTasks.upcoming.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-sm text-slate-500 text-center">
                    Nenhuma próxima tarefa agendada.
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
