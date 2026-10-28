import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Supplier, SupplierType, SupplierVerificationStatus } from '../types';

export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers:', error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        businessName: row.business_name,
        supplierType: row.supplier_type as SupplierType,
        verificationStatus: row.verification_status as SupplierVerificationStatus,
        businessRegistration: row.business_registration,
        contactPhone: row.contact_phone,
        location: row.location,
        sourceDescription: row.source_description || '',
        rating: Number(row.rating || 0),
        totalReviews: Number(row.total_reviews || 0),
        isDemo: Boolean(row.is_demo),
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.error('getSuppliers error:', err);
      return [];
    }
  },

  async getSupplierByUserId(userId: string): Promise<Supplier | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        businessName: data.business_name,
        supplierType: data.supplier_type as SupplierType,
        verificationStatus: data.verification_status as SupplierVerificationStatus,
        businessRegistration: data.business_registration,
        contactPhone: data.contact_phone,
        location: data.location,
        sourceDescription: data.source_description || '',
        rating: Number(data.rating || 0),
        totalReviews: Number(data.total_reviews || 0),
        isDemo: Boolean(data.is_demo),
        createdAt: data.created_at,
      };
    } catch (err) {
      return null;
    }
  },

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const payload: Record<string, any> = {};
      if (updates.businessName !== undefined) payload.business_name = updates.businessName;
      if (updates.supplierType !== undefined) payload.supplier_type = updates.supplierType;
      if (updates.verificationStatus !== undefined) payload.verification_status = updates.verificationStatus;
      if (updates.businessRegistration !== undefined) payload.business_registration = updates.businessRegistration;
      if (updates.contactPhone !== undefined) payload.contact_phone = updates.contactPhone;
      if (updates.location !== undefined) payload.location = updates.location;
      if (updates.sourceDescription !== undefined) payload.source_description = updates.sourceDescription;

      const { error } = await supabase
        .from('suppliers')
        .update(payload)
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async verifySupplier(id: string, status: SupplierVerificationStatus): Promise<{ success: boolean; error?: string }> {
    return this.updateSupplier(id, { verificationStatus: status });
  },
};
