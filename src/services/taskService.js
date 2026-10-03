import { localStorageService } from './localStorageService';
import { supabaseService } from './supabaseService';

// Flag de controle: ativa o Supabase quando as variáveis de ambiente estiverem configuradas
export const USE_SUPABASE = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const activeStorage = USE_SUPABASE ? supabaseService : localStorageService;

export const taskService = {
  isSupabase: USE_SUPABASE,
  storageName: USE_SUPABASE ? 'Supabase (Nuvem)' : 'LocalStorage (Navegador)',
  getTasks: () => activeStorage.getTasks(),
  createTask: (taskData) => activeStorage.createTask(taskData),
  updateTask: (id, updates) => activeStorage.updateTask(id, updates),
  deleteTask: (id) => activeStorage.deleteTask(id),
  toggleComplete: (id) => activeStorage.toggleComplete(id),
  resetDefaults: () => activeStorage.resetDefaults()
};
