import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  BarChart, 
  KeyRound, 
  LogOut, 
  Edit3, 
  Save, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileModal({ isOpen, onClose, stats = {}, onOpenLogoutModal }) {
  const { user, profile, updateUserProfile, updatePassword } = useAuth();

  // Estados de edição de nome
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [savingName, setSavingName] = useState(false);

  // Estados de alteração de senha
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Mensagens de feedback
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  if (!isOpen) return null;

  // Atualizar nome no perfil
  const handleSaveName = async () => {
    if (!fullName.trim()) return;
    setSavingName(true);
    setFeedback(null);

    const result = await updateUserProfile({ full_name: fullName.trim() });
    setSavingName(false);

    if (result.success) {
      setIsEditingName(false);
      setFeedback({ type: 'success', message: 'Nome atualizado com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Erro ao atualizar nome.' });
    }
  };

  // Alterar senha
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    setSavingPassword(true);
    const result = await updatePassword(newPassword);
    setSavingPassword(false);

    if (result.success) {
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Senha alterada com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Erro ao alterar senha.' });
    }
  };

  // Obter iniciais do nome
  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'US';
  };

  // Formatar data de criação
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recente';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
  const displayEmail = profile?.email || user?.email || '';
  const createdAt = profile?.created_at || user?.created_at;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Cabeçalho do Card com Gradiente */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-indigo-700 font-extrabold text-xl flex items-center justify-center shadow-lg shadow-black/10 ring-4 ring-white/20 flex-shrink-0">
              {getInitials(displayName, displayEmail)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold truncate text-white">{displayName}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Supabase
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{displayEmail}</span>
              </p>
              <p className="text-[11px] text-indigo-200/80 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>Membro desde {formatDate(createdAt)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Mensagens de Feedback */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Seção 1: Informações Básicas do Perfil */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Informações da Conta
              </span>
              {!isEditingName && (
                <button
                  type="button"
                  onClick={() => {
                    setFullName(displayName);
                    setIsEditingName(true);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar Nome</span>
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Nome de Exibição:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Seu nome"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {savingName ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Salvar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-xs text-slate-500">Nome:</span>
                  <span className="font-semibold text-slate-900">{displayName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-xs text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-900">{displayEmail}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-xs text-slate-500">ID Único (Supabase):</span>
                  <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]" title={user?.id}>
                    {user?.id}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Seção 2: Estatísticas de Produtividade do Usuário */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              Suas Métricas de Produtividade
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-indigo-700 block">Total</span>
                <span className="text-2xl font-black text-indigo-900">{stats.total || 0}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">tarefas</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-emerald-700 block">Concluídas</span>
                <span className="text-2xl font-black text-emerald-900">{stats.completed || 0}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">tarefas</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-amber-700 block">Pendentes</span>
                <span className="text-2xl font-black text-amber-900">{stats.pending || 0}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">tarefas</span>
              </div>
            </div>

            {/* Barra de Taxa de Conclusão */}
            <div className="mt-3 bg-slate-100 p-3 rounded-2xl border border-slate-200/70">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Taxa Geral de Conclusão</span>
                <span className="text-indigo-600 font-extrabold">{stats.rate || 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.rate || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Alteração de Senha */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer p-2 rounded-xl hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Alterar Senha de Acesso</span>
              </div>
              <span className="text-indigo-600">{showPasswordChange ? 'Ocultar' : 'Expandir'}</span>
            </button>

            {showPasswordChange && (
              <form onSubmit={handleUpdatePassword} className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nova Senha:</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmar Nova Senha:</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {savingPassword ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Atualizando senha...</span>
                    </>
                  ) : (
                    <span>Salvar Nova Senha</span>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenLogoutModal) onOpenLogoutModal();
            }}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
