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

  const fetchDemoProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching demo profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching demo profile:', error);
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
    // Handle demo credentials by fetching from database
    if (email === 'admin@accessscan.com' && password === 'admin123') {
      const demoProfile = await fetchDemoProfile(email);
      if (demoProfile) {
        setProfile(demoProfile);
        setUser({
          id: demoProfile.id,
          email: demoProfile.email,
          user_metadata: { full_name: demoProfile.full_name },
          app_metadata: {},
          aud: 'authenticated',
          created_at: demoProfile.created_at,
          updated_at: demoProfile.updated_at
        } as User);
        setSession({
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: demoProfile.id,
            email: demoProfile.email,
            user_metadata: { full_name: demoProfile.full_name },
            app_metadata: {},
            aud: 'authenticated',
            created_at: demoProfile.created_at,
            updated_at: demoProfile.updated_at
          } as User
        } as Session);
        
        // Update last login
        await updateLastLogin(demoProfile.id);
        return { error: null };
      }
    }

    if (email === 'user@example.com' && password === 'user123') {
      const demoProfile = await fetchDemoProfile(email);
      if (demoProfile) {
        setProfile(demoProfile);
        setUser({
          id: demoProfile.id,
          email: demoProfile.email,
          user_metadata: { full_name: demoProfile.full_name },
          app_metadata: {},
          aud: 'authenticated',
          created_at: demoProfile.created_at,
          updated_at: demoProfile.updated_at
        } as User);
        setSession({
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: demoProfile.id,
            email: demoProfile.email,
            user_metadata: { full_name: demoProfile.full_name },
            app_metadata: {},
            aud: 'authenticated',
            created_at: demoProfile.created_at,
            updated_at: demoProfile.updated_at
          } as User
        } as Session);
        
        // Update last login
        await updateLastLogin(demoProfile.id);
        return { error: null };
      }
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

    // For demo users, update in database
    if (user.email === 'admin@accessscan.com' || user.email === 'user@example.com') {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
      }
      return { error };
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

  const isAdmin = profile?.role === 'admin';

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