import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isPasswordRecoveryRedirect } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isRecoveringPassword: boolean;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  authError: string;
  setAuthError: (authError: string) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRecoveringPassword, setRecoveringPassword] = useState(isPasswordRecoveryRedirect);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    let active = true;
    // Subscribe before reading the session so startup recovery events are not missed.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY') setRecoveringPassword(true);
      if (event === 'SIGNED_OUT') setRecoveringPassword(false);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    const getSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) setAuthError(error.message);
        setUser(data.session?.user ?? null);
        setToken(data.session?.access_token ?? null);
      } catch (err) {
        if (active) setAuthError(err instanceof Error ? err.message : String(err));
      } finally {
        if (active) setLoading(false);
      }
    };
    getSession();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setToken(data.session?.access_token ?? null);
      return { success: true };
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user);
      setToken(data.session?.access_token ?? null);
      return { success: true };
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setToken(null);
      return { success: true };
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setAuthError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setAuthError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setRecoveringPassword(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        authError,
        setAuthError,
        signIn,
        signUp,
        signOut,
        isRecoveringPassword,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
