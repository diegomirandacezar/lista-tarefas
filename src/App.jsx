import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthView } from './components/auth/AuthView';
import { ProfileModal } from './components/profile/ProfileModal';
import { Navbar } from './components/layout/Navbar';
import { TaskList } from './components/tasks/TaskList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CalendarView } from './components/calendar/CalendarView';
import { useTasks } from './hooks/useTasks';
import { taskService } from './services/taskService';
import { Database, CheckCircle2, Cloud, Sparkles } from 'lucide-react';

function MainApp() {
  const { user, loading: authLoading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'analytics' | 'calendar'
  const [notification, setNotification] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const {
    tasks,
    loading: tasksLoading,
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
  } = useTasks(user?.id);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddTask = async (taskData) => {
    await addTask(taskData);
    showNotification('Tarefa criada com sucesso!');
  };

  const handleEditTask = async (id, taskData) => {
    await editTask(id, taskData);
    showNotification('Tarefa atualizada com sucesso!');
  };

  const handleToggleTask = async (id) => {
    const updated = await toggleTask(id);
    if (updated) {
      showNotification(
        updated.completed ? 'Tarefa marcada como concluída! 🎉' : 'Tarefa marcada como pendente.'
      );
    }
  };

  const handleDeleteTask = async (id) => {
    await removeTask(id);
    showNotification('Tarefa excluída com sucesso.', 'info');
  };

  const handleResetTasks = async () => {
    await resetToDefaults();
    showNotification('Tarefas de exemplo restauradas.');
  };

  // 1. Tela de Carregamento Inicial de Sessão
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 animate-pulse mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-300">Carregando TaskFlow Pro...</p>
      </div>
    );
  }

  // 2. Tela de Redefinição de Senha (se o usuário chegou via link de recuperação do Supabase)
  if (isPasswordRecovery) {
    return (
      <AuthView 
        isRecoveryMode={true} 
        onExitRecovery={() => setIsPasswordRecovery(false)} 
      />
    );
  }

  // 3. Tela de Login / Cadastro / Recuperação (se não autenticado)
  if (!user) {
    return <AuthView />;
  }

  // 4. Aplicação Principal (Usuário Autenticado com Perfil e Tarefas)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        taskCount={stats.pending}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Modal de Perfil do Usuário */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        stats={stats}
      />

      {/* Notificação Toast Flutuante */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-sm font-semibold rounded-2xl shadow-xl border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Conteúdo Central Responsivo */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {tasksLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="mt-3 text-sm text-slate-500 font-medium">Carregando suas tarefas...</span>
          </div>
        ) : (
          <>
            {activeTab === 'tasks' && (
              <TaskList
                tasks={tasks}
                filteredTasks={filteredTasks}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onResetTasks={handleResetTasks}
                stats={stats}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView tasks={tasks} stats={stats} />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </>
        )}
      </main>

      {/* Rodapé da Aplicação */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">TaskFlow App</span>
            <span>•</span>
            <span>{taskService.isSupabase ? 'Persistência em Nuvem (Supabase)' : 'Persistência Local (LocalStorage)'}</span>
          </div>
          {taskService.isSupabase ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50/90 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conectado: Supabase (lista-tarefas) • RLS Ativo por Usuário</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-indigo-700 font-semibold bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pronto para conexão Supabase</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
