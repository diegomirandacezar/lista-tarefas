import { createClient } from '@supabase/supabase-js';
import { INITIAL_TASKS } from '../constants/taskConstants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Conversão do formato retornado pelo Supabase (snake_case) para a UI (camelCase)
const mapFromDB = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
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
  if (data.userId !== undefined) payload.user_id = data.userId;
  return payload;
};

// Tradutor amigável de erros de autenticação do Supabase para pt-BR
export const formatAuthError = (error) => {
  if (!error) return 'Ocorreu um erro desconhecido.';
  const msg = error.message || '';
  
  if (msg.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos. Por favor, verifique suas credenciais.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'Este email ainda não foi confirmado. Verifique sua caixa de entrada ou spam.';
  }
  if (msg.includes('User already registered')) {
    return 'Já existe uma conta registrada com este email. Faça login ou recupere sua senha.';
  }
  if (msg.includes('Password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
    return 'Muitas solicitações enviadas recentemente. Aguarde alguns instantes antes de tentar novamente.';
  }
  if (msg.includes('Email rate limit exceeded')) {
    return 'Limite de envio de emails excedido. Aguarde alguns minutos.';
  }
  if (msg.includes('Signup requires a valid password')) {
    return 'Por favor, insira uma senha válida com pelo menos 6 caracteres.';
  }
  if (msg.includes('Unable to validate email address: invalid format')) {
    return 'Formato de email inválido. Verifique o endereço digitado.';
  }

  return msg || 'Ocorreu um erro na autenticação. Tente novamente.';
};

export const supabaseService = {
  // ==========================================
  // AUTENTICAÇÃO E PERFIL DE USUÁRIO
  // ==========================================

  /**
   * Realiza login com email e senha
   */
  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase não inicializado.');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw error;
    return data;
  },

  /**
   * Cria nova conta de usuário no Supabase
   */
  signUp: async (email, password, fullName) => {
    if (!supabase) throw new Error('Supabase não inicializado.');
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName?.trim() || email.split('@')[0]
        }
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Encerra a sessão atual
   */
  signOut: async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Solicita email para recuperação/redefinição de senha
   */
  resetPassword: async (email) => {
    if (!supabase) throw new Error('Supabase não inicializado.');
    const redirectUrl = window.location.origin;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl
    });
    if (error) throw error;
    return data;
  },

  /**
   * Atualiza a senha do usuário atualmente autenticado
   */
  updatePassword: async (newPassword) => {
    if (!supabase) throw new Error('Supabase não inicializado.');
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  },

  /**
   * Obtém a sessão atual
   */
  getSession: async () => {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session;
  },

  /**
   * Obtém os dados do usuário autenticado
   */
  getCurrentUser: async () => {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  },

  /**
   * Busca o perfil do usuário na tabela public.profiles
   */
  getProfile: async (userId) => {
    if (!supabase || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Erro ao consultar perfil no Supabase:', error);
      return null;
    }
    return data;
  },

  /**
   * Atualiza as informações do perfil do usuário
   */
  updateProfile: async (userId, updates) => {
    if (!supabase || !userId) throw new Error('Supabase não inicializado.');
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil no Supabase:', error);
      throw error;
    }
    return data;
  },

  // ==========================================
  // GESTÃO DE TAREFAS POR USUÁRIO
  // ==========================================

  /**
   * Busca tarefas no Supabase pertencentes ao usuário logado
   */
  getTasks: async (userId = null) => {
    if (!supabase) {
      console.warn('Supabase não inicializado. Verifique as credenciais no .env');
      return [];
    }

    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    // Se informado userId, filtra explicitamente (além da regra RLS do Supabase)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao consultar tarefas no Supabase:', error);
      throw error;
    }

    return (data || []).map(mapFromDB);
  },

  /**
   * Insere uma nova tarefa no banco de dados vinculada ao usuário
   */
  createTask: async (taskData, userId = null) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      targetUserId = user?.id;
    }

    const payload = {
      ...mapToDB(taskData),
      ...(targetUserId ? { user_id: targetUserId } : {}),
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
   * Restaura tarefas de exemplo para o usuário logado
   */
  resetDefaults: async (userId = null) => {
    if (!supabase) throw new Error('Supabase não inicializado.');

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      targetUserId = user?.id;
    }

    if (targetUserId) {
      await supabase.from('tasks').delete().eq('user_id', targetUserId);
    } else {
      await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const initialRows = INITIAL_TASKS.map((t) => ({
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      due_date: t.dueDate,
      completed: t.completed,
      ...(targetUserId ? { user_id: targetUserId } : {})
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
