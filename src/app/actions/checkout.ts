'use server';

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the Service Role key to bypass RLS for creating orders and temp products
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function processCheckout(orderData: any, cartItems: any[]) {
  try {
    // 1. Insert Order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        buyer_name_snapshot: orderData.name,
        buyer_email_snapshot: orderData.email,
        shipping_address: `${orderData.address}, ${orderData.ward}, ${orderData.district}, ${orderData.city}`,
        total_price: orderData.total,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderErr) throw orderErr;

    // 2. Process Items
    const orderItemsToInsert = [];
    
    for (const item of cartItems) {
      let productId = item.id;
      
      if (item.isCustom) {
        // Create a temporary product for the custom design to store specs and snapshot
        const { data: newProd, error: prodErr } = await supabaseAdmin
          .from('products')
          .insert({
            name: item.name,
            category: 'custom',
            price: item.price,
            description: JSON.stringify(item.customSpecs || {}),
            image_url: item.image,
            stock: 1
          })
          .select('id')
          .single();
          
        if (!prodErr && newProd) {
          productId = newProd.id;
        } else {
          console.error("Failed to create custom product:", prodErr);
          productId = null;
        }
      }
      
      orderItemsToInsert.push({
        order_id: order.id,
        product_id: productId === item.id ? (item.isCustom ? null : productId) : productId,
        quantity: item.quantity,
        price: item.price,
        status: 'pending'
      });
    }

    // 3. Insert Order Items
    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsErr) throw itemsErr;

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Checkout Server Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
