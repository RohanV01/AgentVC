import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  founder_name?: string;
  website?: string;
  linkedin_profile?: string;
  startup_info?: {
    startup_name?: string;
    one_liner_pitch?: string;
    industry?: string;
    business_model?: string;
    funding_round?: string;
    raise_amount?: string;
    use_of_funds?: string;
  };
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log('🔍 Checking for existing session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error fetching session:', error);
          setUser(null);
          setUserProfile(null);
        } else if (session?.user) {
          console.log('✅ Found existing session for user:', session.user.email);
          setUser({ id: session.user.id, email: session.user.email! });
          await fetchUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No existing session found');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Error in fetchUser:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (session?.user) {
          console.log('✅ User signed in:', session.user.email);
          setUser({ id: session.user.id, email: session.user.email! });
          await fetchUserProfile(session.user.id);
        } else {
          console.log('👋 User signed out');
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('📋 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ No profile found for user, will be created on next update');
          setUserProfile(null);
        } else {
          console.error('❌ Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else if (data) {
        console.log('✅ User profile loaded:', {
          founder_name: data.founder_name,
          startup_name: data.startup_info?.startup_name,
          industry: data.startup_info?.industry
        });
        setUserProfile(data as UserProfile);
      } else {
        console.log('ℹ️ No profile data returned');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Exception in fetchUserProfile:', error);
      setUserProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('❌ Login error:', error);
        throw new Error(error.message);
      }
      
      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        setUser({ id: data.user.id, email: data.user.email! });
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      console.log('📝 Starting signup process for:', email);
      console.log('📋 Profile data received:', {
        founder_name: profileData.founder_name,
        startup_name: profileData.startup_info?.startup_name,
        industry: profileData.startup_info?.industry,
        funding_round: profileData.startup_info?.funding_round,
        raise_amount: profileData.startup_info?.raise_amount
      });
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (authError) {
        console.error('❌ Auth signup error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('✅ Auth user created:', authData.user.email);
      
      const newUser = { id: authData.user.id, email: authData.user.email! };
      setUser(newUser);

      // Wait a moment for the auth trigger to potentially create the basic profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create or update the profile record with all data
      console.log('💾 Creating/updating user profile in database...');
      
      const profileRecord = {
        id: newUser.id,
        email: newUser.email,
        founder_name: profileData.founder_name || null,
        website: profileData.website || null,
        linkedin_profile: profileData.linkedin_profile || null,
        startup_info: profileData.startup_info || {},
        created_at: new Date().toISOString()
      };

      console.log('📤 Upserting profile record:', profileRecord);

      // Use upsert to handle both insert and update cases
      const { data: profileResult, error: profileError } = await supabase
        .from('users')
        .upsert([profileRecord], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation/update error:', profileError);
        
        // Don't clean up auth user, just throw error
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      console.log('✅ Profile created/updated successfully:', profileResult);
      setUserProfile(profileResult as UserProfile);
      
      // Verify the data was saved correctly
      console.log('🔍 Verifying saved data...');
      await fetchUserProfile(newUser.id);
      
    } catch (error) {
      console.error('❌ Signup exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('👋 Logging out user...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ Logout successful');
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('❌ Logout exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in to update profile');
    }
    
    try {
      setLoading(true);
      console.log('🔄 Updating user profile...');

      const { startup_info, ...restProfile } = profile;

      const updateData = {
        ...restProfile,
        startup_info: { 
          ...userProfile?.startup_info, 
          ...startup_info 
        }
      };

      console.log('📤 Update data:', updateData);

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Profile update error:', error);
        throw new Error(error.message);
      }
      
      if (data) {
        console.log('✅ Profile updated successfully:', data);
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('❌ Update profile exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    login,
    signup,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};