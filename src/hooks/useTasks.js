import { useState, useEffect, useMemo, useCallback } from 'react';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('todas'); // 'todas' | 'pendentes' | 'concluidas'
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar tarefas iniciais
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error('Falha ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Criar tarefa
  const addTask = async (taskData) => {
    const created = await taskService.createTask(taskData);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  // Atualizar tarefa
  const editTask = async (id, updates) => {
    const updated = await taskService.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // Alternar status concluída/pendente
  const toggleTask = async (id) => {
    const updated = await taskService.toggleComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // Excluir tarefa
  const removeTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Restaurar dados padrão para demonstração
  const resetToDefaults = async () => {
    const defaults = await taskService.resetDefaults();
    setTasks(defaults);
  };

  // Tarefas filtradas
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtro de status (Todas, Pendentes, Concluídas)
      if (statusFilter === 'pendentes' && task.completed) return false;
      if (statusFilter === 'concluidas' && !task.completed) return false;

      // Filtro por Categoria
      if (categoryFilter !== 'todas' && task.category !== categoryFilter) return false;

      // Filtro por Prioridade
      if (priorityFilter !== 'todas' && task.priority !== priorityFilter) return false;

      // Filtro por Busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  // Métricas e estatísticas para a aba Análises
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    const byPriority = tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      completed,
      pending,
      rate,
      byCategory,
      byPriority
    };
  }, [tasks]);

  return {
    tasks,
    loading,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    stats,
    addTask,
    editTask,
    toggleTask,
    removeTask,
    resetToDefaults
  };
}
