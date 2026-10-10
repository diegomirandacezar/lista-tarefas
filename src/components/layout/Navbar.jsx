import React, { useState } from 'react';
import { 
  CheckSquare, 
  BarChart3, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar({ activeTab, setActiveTab, taskCount, onOpenProfile }) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: taskCount },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
  const displayEmail = profile?.email || user?.email || '';

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'US';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo e Nome da Aplicação */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <CheckSquare className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  TaskFlow
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-600 hidden sm:block -mt-0.5">Gestão Pessoal & Produtividade</p>
              </div>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Ações do Usuário e Perfil (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Botão de Perfil */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 transition-all text-left cursor-pointer group"
                title="Abrir meu perfil"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(displayName, displayEmail)}
                </div>
                <div className="max-w-[140px]">
                  <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-indigo-700">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {displayEmail}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </button>

              {/* Botão de Sair */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all border border-transparent hover:border-rose-200 cursor-pointer"
                title="Sair da aplicação"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>

            {/* Botão Menu Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Suspenso Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            
            {/* Card de Perfil no Mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {getInitials(displayName, displayEmail)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 block truncate">{displayName}</span>
                <span className="text-xs text-slate-500 block truncate">{displayEmail}</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Ver Perfil</span>
            </button>

            {/* Abas */}
            <div className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modal de Confirmação de Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Deseja realmente sair?"
        message="Sua sessão será encerrada com segurança no Supabase. Você poderá retornar a qualquer momento com seu email e senha."
        confirmText="Confirmar Saída"
        cancelText="Voltar"
        isDestructive={false}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
