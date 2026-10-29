import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, UserRole } from '../types';

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'supplier'; // STRICTLY no admin allowed in registration
  phone?: string;
  preferredPickupPoint?: string;
  businessName?: string;
  businessType?: string;
  operatingRegion?: string;
  businessAddress?: string;
}

export const authService = {
  // Sign up for Buyer or Supplier accounts (Admin is strictly forbidden in registration)
  async signUp(
    payloadOrEmail: SignUpPayload | string,
    passwordArg?: string,
    nameArg?: string,
    phoneArg?: string,
    preferredPickupPointArg?: string
  ): Promise<{ user: User | null; error?: string }> {
    if (!isSupabaseConfigured) {
      return { user: null, error: 'Supabase chưa được cấu hình.' };
    }

    let email = '';
    let password = '';
    let name = '';
    let role: 'buyer' | 'supplier' = 'buyer';
    let phone = '';
    let preferredPickupPoint = '';
    let businessName = '';
    let businessType = '';
    let operatingRegion = '';
    let businessAddress = '';

    if (typeof payloadOrEmail === 'object') {
      email = payloadOrEmail.email;
      password = payloadOrEmail.password;
      name = payloadOrEmail.name;
      // Enforce: role is strictly buyer or supplier
      role = payloadOrEmail.role === 'supplier' ? 'supplier' : 'buyer';
      phone = payloadOrEmail.phone || '';
      preferredPickupPoint = payloadOrEmail.preferredPickupPoint || '';
      businessName = payloadOrEmail.businessName || '';
      businessType = payloadOrEmail.businessType || '';
      operatingRegion = payloadOrEmail.operatingRegion || '';
      businessAddress = payloadOrEmail.businessAddress || '';
    } else {
      email = payloadOrEmail;
      password = passwordArg || '';
      name = nameArg || '';
      role = 'buyer';
      phone = phoneArg || '';
      preferredPickupPoint = preferredPickupPointArg || '';
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            preferred_pickup_point: preferredPickupPoint,
            role, // strictly buyer or supplier
            business_name: businessName,
            business_type: businessType,
            operating_region: operatingRegion,
            business_address: businessAddress,
          },
        },
      });

      if (error) {
        const rawErr = error.message.toLowerCase();
        if (rawErr.includes('already registered') || rawErr.includes('user already exists')) {
          return { user: null, error: 'Email này đã được sử dụng.' };
        }
        if (rawErr.includes('password') || rawErr.includes('weak')) {
          return { user: null, error: 'Mật khẩu chưa đáp ứng yêu cầu bảo mật.' };
        }
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

      // If supplier registered, create or link supplier record if table exists
      if (role === 'supplier' && businessName) {
        try {
          await supabase.from('suppliers').insert({
            id: `sup-${data.user.id.slice(0, 8)}`,
            user_id: data.user.id,
            business_name: businessName,
            supplier_type: businessType || 'local_retailer',
            verification_status: 'pending',
            phone: phone,
          });
        } catch (supErr) {
          console.warn('Could not auto-insert supplier table row:', supErr);
        }
      }

      const appUser: User = {
        id: data.user.id,
        name: profile?.name || name,
        email: data.user.email || email,
        password: '***',
        role: (profile?.role as UserRole) || role,
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

  // Sign in with email and password (No role selection - role is retrieved from database)
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
        const rawErr = error.message.toLowerCase();
        if (rawErr.includes('invalid') || rawErr.includes('credentials') || rawErr.includes('grant')) {
          return { user: null, error: 'Email hoặc mật khẩu chưa chính xác.' };
        }
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Không tìm thấy người dùng.' };
      }

      // Fetch user profile from database to get genuine verified role
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
        return { user: null, error: 'Tài khoản của bạn đã bị tạm khoá. Vui lòng liên hệ Ban Quản Trị.' };
      }

      const appUser: User = {
        id: data.user.id,
        name: profile.name,
        email: profile.email || data.user.email || email,
        password: '***',
        role: profile.role as UserRole, // Verified role from server profiles table
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
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
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
