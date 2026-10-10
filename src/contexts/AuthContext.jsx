import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, supabaseService, formatAuthError } from '../services/supabaseService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // Carregar dados de perfil a partir do id do usuário
  const fetchProfile = useCallback(async (userId, userEmail, userMeta = {}) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const data = await supabaseService.getProfile(userId);
      if (data) {
        setProfile(data);
        return data;
      } else {
        // Perfil fallback se ainda não foi criado pelo gatilho
        const fallback = {
          id: userId,
          email: userEmail,
          full_name: userMeta?.full_name || userEmail?.split('@')[0] || 'Usuário',
          created_at: new Date().toISOString()
        };
        setProfile(fallback);
        return fallback;
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      return null;
    }
  }, []);

  // Monitorar estado de autenticação inicial e alterações
  useEffect(() => {
    // Detectar link de recuperação na URL (#type=recovery ou ?type=recovery)
    const checkRecoveryInUrl = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setIsPasswordRecovery(true);
      }
    };
    checkRecoveryInUrl();

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      if (currentSession?.user) {
        fetchProfile(
          currentSession.user.id,
          currentSession.user.email,
          currentSession.user.user_metadata
        );
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Erro ao verificar sessão inicial:', err);
      setLoading(false);
    });

    // Ouvinte em tempo real para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }

        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (newSession?.user) {
            await fetchProfile(
              newSession.user.id,
              newSession.user.email,
              newSession.user.user_metadata
            );
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsPasswordRecovery(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Ações de Autenticação
  const signIn = async (email, password) => {
    try {
      const data = await supabaseService.signIn(email, password);
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: formatAuthError(error), rawError: error };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const data = await supabaseService.signUp(email, password, fullName);
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email, { full_name: fullName });
      }
      return {
        success: true,
        data,
        needsEmailConfirmation: !data.session && !data.user?.confirmed_at
      };
    } catch (error) {
      return { success: false, error: formatAuthError(error), rawError: error };
    }
  };

  const signOut = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsPasswordRecovery(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const resetPassword = async (email) => {
    try {
      const data = await supabaseService.resetPassword(email);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const data = await supabaseService.updatePassword(newPassword);
      setIsPasswordRecovery(false);
      // Limpa hashes da URL para evitar reabertura da tela de recuperação
      if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname);
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };
    try {
      const updated = await supabaseService.updateProfile(user.id, updates);
      setProfile((prev) => ({ ...prev, ...updated }));
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isPasswordRecovery,
    setIsPasswordRecovery,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUserProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
