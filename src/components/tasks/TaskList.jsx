import React, { useState } from 'react';
import { Plus, CheckCircle2, RotateCcw, Inbox } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { TaskFilter } from './TaskFilter';
import { TaskSearch } from './TaskSearch';
import { TaskModal } from './TaskModal';

export function TaskList({
  tasks,
  filteredTasks,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  onResetTasks,
  stats
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [taskEditing, setTaskEditing] = useState(null);

  const handleOpenCreate = () => {
    setTaskEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setTaskEditing(task);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskEditing) {
      onEditTask(taskEditing.id, taskData);
    } else {
      onAddTask(taskData);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Topo: Título da Sessão + Botão Nova Tarefa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Minhas Tarefas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Você tem <strong className="text-indigo-600 font-bold">{stats.pending} tarefas pendentes</strong> para concluir hoje e nos próximos dias.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <TaskFilter
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            counts={{
              total: stats.total,
              pending: stats.pending,
              completed: stats.completed
            }}
          />
        </div>

        <TaskSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      {/* Lista de Tarefas ou Estado Vazio */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onEdit={handleOpenEdit}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhuma tarefa encontrada</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || categoryFilter !== 'todas' || priorityFilter !== 'todas'
              ? 'Tente ajustar os filtros ou a busca para localizar o que precisa.'
              : 'Você não tem tarefas nesta lista no momento. Comece criando uma nova!'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Tarefa</span>
            </button>
            {tasks.length === 0 && (
              <button
                type="button"
                onClick={onResetTasks}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Exemplos</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskEditing}
      />
    </div>
  );
}
