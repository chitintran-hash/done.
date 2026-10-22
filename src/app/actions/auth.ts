'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function ensureUserProfile(data: {
  userId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    if (!data.userId) {
      return { success: false, error: 'Thiếu User ID' };
    }

    // Check if profile exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.userId)
      .maybeSingle();

    if (fetchErr) {
      console.error('Error fetching profile:', fetchErr);
    }

    if (!existing) {
      // Create new profile row for this auth user
      const { data: created, error: insertErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.userId,
          full_name: data.fullName || (data.email ? data.email.split('@')[0] : 'Khách hàng Cupfy'),
          role: 'customer',
          status: 'active',
          phone_number: data.phone || null,
          address: data.address || null,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Failed to create profile:', insertErr);
        return { success: false, error: insertErr.message };
      }
      return { success: true, profile: created };
    } else {
      // Update phone/address if currently empty and new ones provided
      const updates: Record<string, any> = {};
      if (data.fullName && !existing.full_name) updates.full_name = data.fullName;
      if (data.phone && !existing.phone_number) updates.phone_number = data.phone;
      if (data.address && !existing.address) updates.address = data.address;

      if (Object.keys(updates).length > 0) {
        const { data: updated, error: updateErr } = await supabaseAdmin
          .from('profiles')
          .update(updates)
          .eq('id', data.userId)
          .select()
          .single();

        if (updateErr) {
          console.error('Failed to update profile:', updateErr);
        }
        return { success: true, profile: updated || existing };
      }

      return { success: true, profile: existing };
    }
  } catch (err: any) {
    console.error('ensureUserProfile error:', err);
    return { success: false, error: err.message };
  }
}

export async function getUserProfile(userId: string) {
  try {
    if (!userId) return null;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('getUserProfile error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('getUserProfile exception:', err);
    return null;
  }
}

export async function registerUserAction(data: {
  email: string;
  password: string;
  fullName: string;
}) {
  try {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPassword = data.password || '';
    const cleanName = (data.fullName || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Vui lòng nhập địa chỉ email.' };
    }
    if (cleanPassword.length < 6) {
      return { success: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự.' };
    }

    // 1. Kiểm tra xem email đã tồn tại hay chưa
    const { data: usersList, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (!listErr && usersList?.users) {
      const existing = usersList.users.find(u => u.email?.toLowerCase() === cleanEmail);
      if (existing) {
        // Nếu user đã tồn tại nhưng chưa confirm, ta auto-confirm luôn giúp họ
        if (!existing.email_confirmed_at) {
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            email_confirm: true,
            password: cleanPassword,
            user_metadata: { full_name: cleanName || existing.user_metadata?.full_name, role: 'customer' }
          });
          await ensureUserProfile({
            userId: existing.id,
            fullName: cleanName,
            email: cleanEmail,
          });
          return { success: true, user: existing, autoActivated: true };
        }
        return { 
          success: false, 
          error: 'Email này đã được đăng ký trên Cupfy. Vui lòng chuyển sang trang Đăng nhập hoặc sử dụng email khác.' 
        };
      }
    }

    // 2. Tạo user mới với email_confirm: true (TỰ ĐỘNG KÍCH HOẠT TỨC THÌ - KHÔNG CẦN CHỜ EMAIL)
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: cleanPassword,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        role: 'customer',
      },
    });

    if (createErr) {
      console.error('Error creating user via admin API:', createErr);
      return { success: false, error: createErr.message };
    }

    if (createdUser?.user) {
      // 3. Đảm bảo profile trong public.profiles
      await ensureUserProfile({
        userId: createdUser.user.id,
        fullName: cleanName,
        email: cleanEmail,
      });
      return { success: true, user: createdUser.user };
    }

    return { success: false, error: 'Không thể tạo tài khoản, vui lòng thử lại.' };
  } catch (err: any) {
    console.error('registerUserAction exception:', err);
    return { success: false, error: err.message || 'Đã có lỗi xảy ra khi đăng ký.' };
  }
}

export async function autoConfirmUserAction(email: string) {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const target = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
    if (target) {
      await supabaseAdmin.auth.admin.updateUserById(target.id, { email_confirm: true });
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy tài khoản.' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

