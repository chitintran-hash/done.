"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const serverClient = await createServerSupabase();
    const { data: { user } } = await serverClient.auth.getUser();
    if (!user) return false;
    
    // Check email
    if (user.email?.toLowerCase().trim() === 'tranchitin2006@gmail.com') {
      return true;
    }
    
    // Check role in profiles
    const adminClient = getAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    return profile?.role === 'admin';
  } catch (err) {
    return false;
  }
}

export async function uploadPostImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'Không tìm thấy file ảnh' };
    }

    const adminClient = getAdminClient();
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await adminClient.storage
      .from('done-products')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: pub } = adminClient.storage
      .from('done-products')
      .getPublicUrl(data.path);

    return { success: true, url: pub.publicUrl };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createPost(data: {
  title: string;
  content: string;
  imageUrl?: string;
  category: 'community' | 'about';
  authorName?: string;
  tags?: string[];
}) {
  const adminClient = getAdminClient();
  const dbCategory = data.category === 'about' ? 'admin_about_post' : 'admin_community_post';

  const { data: inserted, error } = await adminClient.from('products').insert({
    name: data.title,
    description: data.content,
    image_url: data.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    category: dbCategory,
    price: 0,
    stock: 999,
    is_available: true,
    technical_specs: {
      author: data.authorName || 'Cupfy Admin',
      tags: data.tags || [],
      publishedAt: new Date().toISOString(),
      type: data.category,
    },
  }).select().single();

  if (error) throw new Error(error.message);

  if (data.category === 'community') {
    revalidatePath('/community');
  } else {
    revalidatePath('/about');
  }

  return inserted;
}

export async function getPosts(category: 'community' | 'about') {
  const adminClient = getAdminClient();
  const dbCategory = category === 'about' ? 'admin_about_post' : 'admin_community_post';

  const { data, error } = await adminClient
    .from('products')
    .select('*')
    .eq('category', dbCategory)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    title: item.name,
    content: item.description,
    imageUrl: item.image_url,
    createdAt: item.created_at,
    author: item.technical_specs?.author || 'Cupfy Admin',
    tags: item.technical_specs?.tags || [],
  }));
}

export async function deletePost(id: string, category: 'community' | 'about') {
  const adminClient = getAdminClient();

  const { error } = await adminClient
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (category === 'community') {
    revalidatePath('/community');
  } else {
    revalidatePath('/about');
  }

  return { success: true };
}
