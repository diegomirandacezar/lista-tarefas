import React, { useState } from 'react';
import { Calendar, Trash2, Edit3, Check } from 'lucide-react';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';

export function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Formatação amigável da data de vencimento
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'Sem data';
    try {
      const [year, month, day] = dateStr.split('-');
      const dateObj = new Date(year, month - 1, day);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const itemDate = new Date(year, month - 1, day);
      itemDate.setHours(0, 0, 0, 0);

      const diffTime = itemDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let relativeLabel = '';
      let isOverdue = false;

      if (diffDays < 0 && !task.completed) {
        relativeLabel = ' (Atrasada)';
        isOverdue = true;
      } else if (diffDays === 0) {
        relativeLabel = ' (Hoje)';
      } else if (diffDays === 1) {
        relativeLabel = ' (Amanhã)';
      }

      const formatted = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(dateObj);

      return { text: `${formatted}${relativeLabel}`, isOverdue };
    } catch {
      return { text: dateStr, isOverdue: false };
    }
  };

  const { text: dueDateFormatted, isOverdue } = formatDueDate(task.dueDate);

  return (
    <>
      <div
        className={`group relative flex items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 ${
          task.completed
            ? 'border-slate-200/60 bg-slate-50/70 opacity-60 shadow-none'
            : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50/50 shadow-xs'
        }`}
      >
        {/* Lado Esquerdo: Checkbox Customizado e Conteúdo Principal */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          
          {/* Checkbox Customizado */}
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            onClick={() => onToggle(task.id)}
            className={`mt-0.5 sm:mt-0 relative flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
              task.completed
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'border-slate-300 hover:border-indigo-500 bg-white'
            }`}
            title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {task.completed && <Check className="w-4 h-4 stroke-[3] animate-in zoom-in-75 duration-150" />}
          </button>

          {/* Textos e Tags */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Tags coloridas de Categoria e Prioridade */}
              <CategoryBadge category={task.category} />
              <PriorityBadge priority={task.priority} />

              {/* Data de Vencimento com Ícone de Calendário */}
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOverdue
                    ? 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold'
                    : 'text-slate-500 bg-slate-100/80 border border-slate-200/60'
                }`}
                title="Data de vencimento"
              >
                <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>{dueDateFormatted}</span>
              </div>
            </div>

            {/* Título da Tarefa em Destaque */}
            <h3
              onClick={() => onToggle(task.id)}
              className={`text-base font-bold text-slate-800 tracking-tight leading-snug cursor-pointer transition-all select-none ${
                task.completed ? 'line-through text-slate-400 font-medium' : 'hover:text-indigo-600'
              }`}
            >
              {task.title}
            </h3>

            {/* Descrição opcional */}
            {task.description && (
              <p
                className={`mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed ${
                  task.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Lado Direito: Ações (Editar e Ícone de Lixeira) */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
            title="Editar tarefa"
            aria-label="Editar tarefa"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Ícone de Lixeira no Canto Direito */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
            title="Excluir tarefa"
            aria-label="Excluir tarefa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Excluir tarefa?"
        message={`Tem certeza que deseja excluir permanentemente a tarefa "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir Tarefa"
        cancelText="Cancelar"
        isDestructive={true}
        onConfirm={() => onDelete(task.id)}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
