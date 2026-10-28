import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, UserRole } from '../types';

export const authService = {
  // Sign up for new Buyer accounts only
  async signUp(email: string, password: string, name: string, phone?: string, preferredPickupPoint?: string): Promise<{ user: User | null; error?: string }> {
    if (!isSupabaseConfigured) {
      return { user: null, error: 'Supabase chưa được cấu hình.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone: phone || '',
            preferred_pickup_point: preferredPickupPoint || '',
            role: 'buyer', // Default role is strictly buyer
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Không thể tạo tài khoản.' };
      }

      // Check or fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const appUser: User = {
        id: data.user.id,
        name: profile?.name || name,
        email: data.user.email || email,
        password: '***',
        role: (profile?.role as UserRole) || 'buyer',
        phone: profile?.phone || phone,
        preferredPickupPoint: profile?.preferred_pickup_point || preferredPickupPoint,
        status: (profile?.status as any) || 'active',
        createdAt: profile?.created_at || new Date().toISOString(),
      };

      return { user: appUser };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { user: null, error: err.message || 'Lỗi đăng ký tài khoản.' };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
    if (!isSupabaseConfigured) {
      return { user: null, error: 'Supabase chưa được cấu hình.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Không tìm thấy người dùng.' };
      }

      // Fetch user profile to get role and details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // Fallback to metadata if profile trigger is delayed
        const meta = data.user.user_metadata || {};
        const fallbackUser: User = {
          id: data.user.id,
          name: meta.name || data.user.email?.split('@')[0] || 'Người dùng',
          email: data.user.email || email,
          password: '***',
          role: (meta.role as UserRole) || 'buyer',
          phone: meta.phone,
          preferredPickupPoint: meta.preferred_pickup_point,
          status: 'active',
          createdAt: data.user.created_at || new Date().toISOString(),
        };
        return { user: fallbackUser };
      }

      if (profile.status === 'suspended') {
        await supabase.auth.signOut();
        return { user: null, error: 'Tài khoản của bạn đã bị tạm khoá. Vui lòng liên hệ Admin.' };
      }

      const appUser: User = {
        id: data.user.id,
        name: profile.name,
        email: profile.email || data.user.email || email,
        password: '***',
        role: profile.role as UserRole,
        phone: profile.phone,
        preferredPickupPoint: profile.preferred_pickup_point,
        status: profile.status,
        createdAt: profile.created_at,
      };

      return { user: appUser };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { user: null, error: err.message || 'Lỗi đăng nhập.' };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // Get current active session user
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile) return null;

      return {
        id: session.user.id,
        name: profile.name,
        email: profile.email || session.user.email || '',
        password: '***',
        role: profile.role as UserRole,
        phone: profile.phone,
        preferredPickupPoint: profile.preferred_pickup_point,
        status: profile.status,
        createdAt: profile.created_at,
      };
    } catch (err) {
      console.error('Get current user error:', err);
      return null;
    }
  },

  // Update profile
  async updateProfile(userId: string, updates: { name?: string; phone?: string; preferredPickupPoint?: string }): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          phone: updates.phone,
          preferred_pickup_point: updates.preferredPickupPoint,
        })
        .eq('id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
