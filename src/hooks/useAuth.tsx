import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'agency';
  plan_status: 'active' | 'suspended' | 'cancelled';
  subscription_id: string | null;
  customer_id: string | null;
  scans_used: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Demo user data - these work without database entries
const DEMO_USERS = {
  'admin@accessscan.com': {
    id: 'demo-admin-uuid-001',
    email: 'admin@accessscan.com',
    full_name: 'Admin User',
    avatar_url: null,
    role: 'admin' as const,
    plan: 'agency' as const,
    plan_status: 'active' as const,
    subscription_id: 'sub_demo_admin',
    customer_id: 'cus_demo_admin',
    scans_used: 25,
    total_spent: 147.00,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  'user@example.com': {
    id: 'demo-user-uuid-002',
    email: 'user@example.com',
    full_name: 'Demo User',
    avatar_url: null,
    role: 'user' as const,
    plan: 'pro' as const,
    plan_status: 'active' as const,
    subscription_id: 'sub_demo_user',
    customer_id: 'cus_demo_user',
    scans_used: 7,
    total_spent: 19.00,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          setProfile(profileData);
          updateLastLogin(session.user.id);
        });
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          if (event === 'SIGNED_IN') {
            updateLastLogin(session.user.id);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('SignIn attempt:', { email, password });
    
    // Handle demo credentials with frontend-only authentication
    if (email === 'admin@accessscan.com' && password === 'admin123') {
      console.log('Demo admin login detected');
      const demoProfile = DEMO_USERS[email];
      
      // Set profile first
      setProfile(demoProfile);
      console.log('Demo profile set:', demoProfile);
      
      // Create demo user object
      const demoUser = {
        id: demoProfile.id,
        email: demoProfile.email,
        user_metadata: { full_name: demoProfile.full_name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: demoProfile.created_at,
        updated_at: demoProfile.updated_at
      } as User;
      
      setUser(demoUser);
      console.log('Demo user set:', demoUser);
      
      // Create demo session
      const demoSession = {
        access_token: 'demo-admin-token',
        refresh_token: 'demo-admin-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: demoUser
      } as Session;
      
      setSession(demoSession);
      console.log('Demo session set:', demoSession);
      
      setLoading(false);
      console.log('Demo admin authentication complete');
      
      return { error: null };
    }

    if (email === 'user@example.com' && password === 'user123') {
      console.log('Demo user login detected');
      const demoProfile = DEMO_USERS[email];
      
      setProfile(demoProfile);
      
      const demoUser = {
        id: demoProfile.id,
        email: demoProfile.email,
        user_metadata: { full_name: demoProfile.full_name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: demoProfile.created_at,
        updated_at: demoProfile.updated_at
      } as User;
      
      setUser(demoUser);
      
      const demoSession = {
        access_token: 'demo-user-token',
        refresh_token: 'demo-user-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: demoUser
      } as Session;
      
      setSession(demoSession);
      setLoading(false);
      
      return { error: null };
    }

    // Try real authentication for other credentials
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    // Clear demo session
    setUser(null);
    setProfile(null);
    setSession(null);
    
    // Also sign out from Supabase in case there's a real session
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    // For demo users, just update local state
    if (user.id.startsWith('demo-')) {
      if (profile) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
      }
      return { error: null };
    }

    // For real users, update in database
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  // Calculate isAdmin based on profile role
  const isAdmin = profile?.role === 'admin';

  // Debug logging
  useEffect(() => {
    console.log('Auth State Update:', {
      loading,
      user: user ? { id: user.id, email: user.email } : null,
      profile: profile ? { id: profile.id, email: profile.email, role: profile.role } : null,
      isAdmin,
      profileRole: profile?.role
    });
  }, [loading, user, profile, isAdmin]);

  const value = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};