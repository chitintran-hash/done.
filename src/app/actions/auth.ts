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
