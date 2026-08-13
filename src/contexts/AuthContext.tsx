'use client';

import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { createClient } from '../lib/supabase/client';

interface AuthContextValue {
  user: any;
  session: any;
  loading: boolean;
  role: string | null;
  pendingVerificationEmail: string | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ needsVerification: boolean; email: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  resendVerificationOtp: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<any>;
  getRole: () => string | null;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const supabase = useMemo(() => createClient(), []);

  const fetchRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      if (mountedRef.current) {
        setRole(data?.role ?? 'patient');
      }
    } catch {
      if (mountedRef.current) setRole('patient');
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id).finally(() => {
          if (mountedRef.current) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id).finally(() => {
          if (mountedRef.current) setLoading(false);
        });
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Email/Password Sign Up — returns needsVerification flag
  // After creating the account, sends an OTP to the user's email via Supabase
  const signUp = async (
    email: string,
    password: string,
    metadata: Record<string, any> = {}
  ): Promise<{ needsVerification: boolean; email: string }> => {
    // Step 1: Create the account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata?.fullName || '',
          avatar_url: metadata?.avatarUrl || '',
          role: metadata?.role || 'patient',
        },
        // Do NOT set emailRedirectTo — we use OTP flow instead of magic link
      }
    });
    if (error) throw error;

    // Step 2: Send OTP for email verification
    // signInWithOtp with shouldCreateUser: false sends a 6-digit OTP to the existing account
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (otpError) {
      // Non-fatal: account was created, OTP send failed — still require verification
      console.warn('OTP send failed after signup:', otpError.message);
    }

    // Track pending verification
    if (mountedRef.current) {
      setPendingVerificationEmail(email);
    }

    return { needsVerification: true, email };
  };

  // Verify the 6-digit OTP sent to the user's email
  const verifyEmailOtp = async (email: string, token: string): Promise<void> => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;

    // OTP verified — session is now active, fetch role
    if (data.user && mountedRef.current) {
      setPendingVerificationEmail(null);
      await fetchRole(data.user.id);
    }
  };

  // Resend OTP to the same email
  const resendVerificationOtp = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) throw error;
  };

  // Email/Password Sign In — blocks unconfirmed users
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    // Block access if email is not confirmed
    if (data.user && !data.user.email_confirmed_at) {
      // Send a fresh OTP so they can verify
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      // Sign them back out — they must verify first
      await supabase.auth.signOut();
      if (mountedRef.current) {
        setPendingVerificationEmail(email);
      }
      throw new Error('Email not confirmed');
    }

    return data;
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
    setPendingVerificationEmail(null);
  };

  // Get Current User
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  // Check if Email is Verified
  const isEmailVerified = () => {
    return !!user?.email_confirmed_at;
  };

  // Get User Profile from Database
  const getUserProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  // Get current role (synchronous helper)
  const getRole = () => role;

  const value: AuthContextValue = {
    user,
    session,
    loading,
    role,
    pendingVerificationEmail,
    signUp,
    verifyEmailOtp,
    resendVerificationOtp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
    getRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
