import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  token: string |null;
  isLoading: boolean;
  authError: string;
  setAuthError: (authError: string) => void;
  signIn: (email: string, password: string) => Promise<{success: boolean, error?: string}>,
  signUp: (email: string, password: string) => Promise<{success: boolean, error?: string}>,
  signOut: () => Promise<{success: boolean, error?: string}>,
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');


  useEffect(() => {
    const getSession = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setToken(data.session?.access_token ?? null);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    setAuthError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setToken(data.session?.access_token ?? null);
      return {success: true};
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return {success: false, error: message}
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    setAuthError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user);
      setToken(data.session?.access_token ?? null);
      return {success: true};
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return {success: false, error: message}
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{success: boolean, error?: string}> => {
    setAuthError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setToken(null);
      return {success: true};
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setAuthError(err instanceof Error ? err.message : String(err));
      return {success: false, error: message}
    } finally {
      setLoading(false);
    }

  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, authError, setAuthError, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};