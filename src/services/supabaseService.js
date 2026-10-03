import { createClient } from '@supabase/supabase-js';
import { INITIAL_TASKS } from '../constants/taskConstants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Conversão do formato retornado pelo Supabase (snake_case) para a UI (camelCase)
const mapFromDB = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category,
    priority: row.priority,
    dueDate: row.due_date,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// Conversão do formato da UI (camelCase) para o Supabase (snake_case)
const mapToDB = (data) => {
  const payload = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.category !== undefined) payload.category = data.category;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.dueDate !== undefined) payload.due_date = data.dueDate;
  if (data.completed !== undefined) payload.completed = data.completed;
  return payload;
};

export const supabaseService = {
  /**
   * Busca todas as tarefas no Supabase ordenadas por data de criação decrescente
   */
  getTasks: async () => {
    if (!supabase) {
      console.warn('Supabase não inicializado. Verifique as credenciais no .env');
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao consultar tarefas no Supabase:', error);
      throw error;
    }

    return (data || []).map(mapFromDB);
  },

  /**
   * Insere uma nova tarefa no banco de dados do Supabase
   */
  createTask: async (taskData) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    const payload = {
      ...mapToDB(taskData),
      completed: false
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar tarefa no Supabase:', error);
      throw error;
    }

    return mapFromDB(data);
  },

  /**
   * Atualiza os campos de uma tarefa existente
   */
  updateTask: async (id, updates) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    const payload = {
      ...mapToDB(updates),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar tarefa no Supabase:', error);
      throw error;
    }

    return mapFromDB(data);
  },

  /**
   * Remove uma tarefa pelo ID
   */
  deleteTask: async (id) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa no Supabase:', error);
      throw error;
    }

    return id;
  },

  /**
   * Alterna o status de concluída/pendente
   */
  toggleComplete: async (id) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    // Obter estado atual para alternar
    const { data: current, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Erro ao obter status da tarefa no Supabase:', fetchError);
      throw fetchError;
    }

    const nextCompleted = !current.completed;
    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed: nextCompleted,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status da tarefa no Supabase:', error);
      throw error;
    }

    return mapFromDB(data);
  },

  /**
   * Limpa as tarefas e restaura os dados de exemplo padrão
   */
  resetDefaults: async () => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    // Exclui todas as tarefas existentes
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Erro ao limpar tarefas no Supabase:', deleteError);
    }

    // Insere tarefas padrão
    const initialRows = INITIAL_TASKS.map((t) => ({
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      due_date: t.dueDate,
      completed: t.completed
    }));

    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert(initialRows)
      .select();

    if (insertError) {
      console.error('Erro ao restaurar tarefas no Supabase:', insertError);
      throw insertError;
    }

    return (data || []).map(mapFromDB);
  }
};
