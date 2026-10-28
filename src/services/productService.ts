import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product, ProductStatus } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        supplierId: row.supplier_id,
        name: row.name,
        category: row.category,
        brand: row.brand,
        unit: row.unit,
        description: row.description || '',
        image: row.image || '📦',
        origin: row.origin,
        stockQuantity: row.stock_quantity,
        minimumOrderQuantity: row.minimum_order_quantity,
        unitCost: row.unit_cost !== null && row.unit_cost !== undefined ? Number(row.unit_cost) : undefined,
        warranty: row.warranty,
        sourceNote: row.source_note || '',
        status: row.status as ProductStatus,
        isDemo: row.is_demo || false,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('getProducts failed:', err);
      return [];
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ product: Product | null; error?: string }> {
    if (!isSupabaseConfigured) return { product: null, error: 'Chưa cấu hình Supabase' };

    try {
      const payload: Record<string, any> = {
        supplier_id: product.supplierId,
        name: product.name,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        description: product.description,
        image: product.image,
        origin: product.origin,
        stock_quantity: product.stockQuantity,
        minimum_order_quantity: product.minimumOrderQuantity,
        warranty: product.warranty,
        source_note: product.sourceNote,
        status: product.status,
        is_demo: product.isDemo,
      };
      if (product.unitCost !== undefined) {
        payload.unit_cost = product.unitCost;
      }

      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (error) return { product: null, error: error.message };

      return {
        product: {
          id: data.id,
          supplierId: data.supplier_id,
          name: data.name,
          category: data.category,
          brand: data.brand,
          unit: data.unit,
          description: data.description || '',
          image: data.image || '📦',
          origin: data.origin,
          stockQuantity: data.stock_quantity,
          minimumOrderQuantity: data.minimum_order_quantity,
          unitCost: data.unit_cost !== null && data.unit_cost !== undefined ? Number(data.unit_cost) : undefined,
          warranty: data.warranty,
          sourceNote: data.source_note || '',
          status: data.status as ProductStatus,
          isDemo: data.is_demo,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      };
    } catch (err: any) {
      return { product: null, error: err.message };
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Chưa cấu hình Supabase' };

    try {
      const payload: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.brand !== undefined) payload.brand = updates.brand;
      if (updates.unit !== undefined) payload.unit = updates.unit;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.image !== undefined) payload.image = updates.image;
      if (updates.origin !== undefined) payload.origin = updates.origin;
      if (updates.stockQuantity !== undefined) payload.stock_quantity = updates.stockQuantity;
      if (updates.minimumOrderQuantity !== undefined) payload.minimum_order_quantity = updates.minimumOrderQuantity;
      if (updates.unitCost !== undefined) payload.unit_cost = updates.unitCost;
      if (updates.warranty !== undefined) payload.warranty = updates.warranty;
      if (updates.sourceNote !== undefined) payload.source_note = updates.sourceNote;
      if (updates.status !== undefined) payload.status = updates.status;

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
