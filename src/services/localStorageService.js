import { INITIAL_TASKS } from '../constants/taskConstants';

const STORAGE_KEY = 'taskflow_tasks_v1';

export const localStorageService = {
  getTasks: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao ler tarefas do LocalStorage:', error);
      return INITIAL_TASKS;
    }
  },

  saveTasks: async (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return tasks;
    } catch (error) {
      console.error('Erro ao salvar tarefas no LocalStorage:', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    const tasks = await localStorageService.getTasks();
    const newTask = {
      ...taskData,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...tasks];
    await localStorageService.saveTasks(updated);
    return newTask;
  },

  updateTask: async (id, updates) => {
    const tasks = await localStorageService.getTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    await localStorageService.saveTasks(updated);
    return updated.find((t) => t.id === id);
  },

  deleteTask: async (id) => {
    const tasks = await localStorageService.getTasks();
    const updated = tasks.filter((t) => t.id !== id);
    await localStorageService.saveTasks(updated);
    return id;
  },

  toggleComplete: async (id) => {
    const tasks = await localStorageService.getTasks();
    const target = tasks.find((t) => t.id === id);
    if (!target) return null;
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t));
    await localStorageService.saveTasks(updated);
    return updated.find((t) => t.id === id);
  },

  resetDefaults: async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
};
