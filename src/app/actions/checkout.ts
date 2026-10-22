'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { ensureUserProfile } from './auth';

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

export interface CheckoutOrderInput {
  buyer_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
}

export async function processCheckout(orderData: CheckoutOrderInput, cartItems: any[]) {
  try {
    // 1. Kiểm tra xác thực khách hàng (Bắt buộc phải đăng nhập)
    if (!orderData.buyer_id) {
      return { 
        success: false, 
        error: 'Vui lòng đăng nhập tài khoản Cupfy trước khi đặt hàng.' 
      };
    }

    // 2. Kiểm tra tính hợp lệ của thông tin nhận hàng
    if (!orderData.name || !orderData.name.trim()) {
      return { success: false, error: 'Vui lòng nhập họ và tên người nhận.' };
    }

    const cleanPhone = (orderData.phone || '').trim().replace(/\s+/g, '');
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return { 
        success: false, 
        error: 'Số điện thoại nhận hàng không hợp lệ. Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.' 
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!orderData.email || !emailRegex.test(orderData.email.trim())) {
      return { success: false, error: 'Địa chỉ email nhận thông báo không hợp lệ.' };
    }

    if (!orderData.address || !orderData.address.trim()) {
      return { success: false, error: 'Vui lòng nhập số nhà và tên đường.' };
    }
    if (!orderData.city || !orderData.city.trim()) {
      return { success: false, error: 'Vui lòng chọn Tỉnh hoặc Thành phố.' };
    }
    if (!orderData.district || !orderData.district.trim()) {
      return { success: false, error: 'Vui lòng chọn Quận hoặc Huyện.' };
    }
    if (!orderData.ward || !orderData.ward.trim()) {
      return { success: false, error: 'Vui lòng chọn Phường hoặc Xã.' };
    }

    // 3. Kiểm tra giỏ hàng
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: false, error: 'Giỏ hàng của bạn đang trống.' };
    }

    // 4 & 5. Kiểm tra sản phẩm và xác minh giá bán trên hệ thống server
    let calculatedSubtotal = 0;
    const validatedItems: Array<{
      isCustom: boolean;
      productId: string | null;
      name: string;
      price: number;
      quantity: number;
      customSpecs?: any;
      image?: string;
    }> = [];

    for (const item of cartItems) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      
      if (item.isCustom) {
        // Ly cá nhân hóa thiết kế từ studio
        const unitPrice = Math.max(20000, Number(item.price) || 69000);
        calculatedSubtotal += unitPrice * quantity;
        validatedItems.push({
          isCustom: true,
          productId: null,
          name: item.name || 'Ly Custom Studio',
          price: unitPrice,
          quantity,
          customSpecs: item.customSpecs || {},
          image: item.image || '',
        });
      } else {
        // Sản phẩm có sẵn trong catalog
        const { data: dbProduct, error: prodErr } = await supabaseAdmin
          .from('products')
          .select('id, name, price, is_available')
          .eq('id', item.id)
          .single();

        if (prodErr || !dbProduct) {
          return {
            success: false,
            error: `Sản phẩm "${item.name}" hiện không còn tồn tại trên hệ thống.`,
          };
        }

        if (dbProduct.is_available === false) {
          return {
            success: false,
            error: `Sản phẩm "${dbProduct.name}" hiện đang tạm ngừng kinh doanh.`,
          };
        }

        const unitPrice = Number(dbProduct.price) || 0;
        calculatedSubtotal += unitPrice * quantity;
        validatedItems.push({
          isCustom: false,
          productId: dbProduct.id,
          name: dbProduct.name,
          price: unitPrice,
          quantity,
          image: item.image || '',
        });
      }
    }

    // Phí vận chuyển cố định: 30.000 VNĐ cho mỗi đơn hàng
    const shippingFee = 30000;
    const calculatedTotal = calculatedSubtotal + shippingFee;

    // 6. ĐỒNG BỘ PROFILE KHÁCH HÀNG (Khắc phục triệt để lỗi orders_buyer_id_fkey)
    const fullAddress = `${orderData.address.trim()}, ${orderData.ward.trim()}, ${orderData.district.trim()}, ${orderData.city.trim()}`;
    await ensureUserProfile({
      userId: orderData.buyer_id,
      fullName: orderData.name.trim(),
      email: orderData.email.trim(),
      phone: cleanPhone,
      address: fullAddress,
    });

    // 7. Tạo đơn hàng Master trong bảng orders
    const structuredAddress = `${fullAddress} | SĐT: ${cleanPhone}${orderData.note ? ' | Ghi chú: ' + orderData.note.trim() : ''} | PT: COD (Chưa thanh toán)`;

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        buyer_id: orderData.buyer_id,
        buyer_name_snapshot: orderData.name.trim(),
        buyer_email_snapshot: orderData.email.trim(),
        shipping_address: structuredAddress,
        total_price: calculatedTotal,
        status: 'pending',
      })
      .select('id, created_at')
      .single();

    if (orderErr) {
      console.error('Lỗi khi chèn đơn hàng vào bảng orders:', orderErr);
      return { 
        success: false, 
        error: 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.' 
      };
    }

    // 8. Tạo chi tiết đơn hàng (order_items)
    const orderItemsToInsert = [];

    for (let idx = 0; idx < validatedItems.length; idx++) {
      const item = validatedItems[idx];
      let finalProductId = item.productId;

      if (item.isCustom) {
        let finalImageUrl = item.image || '';
        let finalPrintUrl = item.customSpecs?.printableTexture || '';

        // Tải ảnh 3D snapshot xem trước lên Supabase Storage nếu là base64 (kèm timeout 3.5s)
        if (finalImageUrl && finalImageUrl.startsWith('data:image/')) {
          try {
            const matches = finalImageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mimeType = matches[1];
              const ext = mimeType.includes('png') ? 'png' : 'jpg';
              const buffer = Buffer.from(matches[2], 'base64');
              const storagePath = `custom-previews/${order.id}-${idx}-${Date.now()}.${ext}`;
              
              const uploadPromise = supabaseAdmin.storage
                .from('done-products')
                .upload(storagePath, buffer, { contentType: mimeType, upsert: true });

              const timeoutPromise = new Promise<{ error: any }>((resolve) =>
                setTimeout(() => resolve({ error: new Error('Storage preview upload timeout') }), 3500)
              );

              const uploadRes = await Promise.race([uploadPromise, timeoutPromise]);
              if (!uploadRes.error) {
                const { data: { publicUrl } } = supabaseAdmin.storage
                  .from('done-products')
                  .getPublicUrl(storagePath);
                finalImageUrl = publicUrl;
              }
            }
          } catch (e) {
            console.error('Error uploading 3D preview:', e);
          }
        }

        // Tải bản in phẳng (Print Sheet) lên Supabase Storage nếu là base64 (kèm timeout 3.5s)
        if (finalPrintUrl && finalPrintUrl.startsWith('data:image/')) {
          try {
            const matches = finalPrintUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mimeType = matches[1];
              const ext = mimeType.includes('png') ? 'png' : 'jpg';
              const buffer = Buffer.from(matches[2], 'base64');
              const storagePath = `custom-prints/${order.id}-${idx}-${Date.now()}.${ext}`;

              const uploadPromise = supabaseAdmin.storage
                .from('done-products')
                .upload(storagePath, buffer, { contentType: mimeType, upsert: true });

              const timeoutPromise = new Promise<{ error: any }>((resolve) =>
                setTimeout(() => resolve({ error: new Error('Storage print upload timeout') }), 3500)
              );

              const uploadRes = await Promise.race([uploadPromise, timeoutPromise]);
              if (!uploadRes.error) {
                const { data: { publicUrl } } = supabaseAdmin.storage
                  .from('done-products')
                  .getPublicUrl(storagePath);
                finalPrintUrl = publicUrl;
              }
            }
          } catch (e) {
            console.error('Error uploading print texture:', e);
          }
        }

        const safeProductImageUrl = finalImageUrl.startsWith('data:')
          ? '/images/cupfy-hero.png'
          : finalImageUrl;

        const snapshotSpecs = {
          ...(item.customSpecs || {}),
          previewImage: finalImageUrl.startsWith('data:') ? '' : finalImageUrl,
          printableTexture: finalPrintUrl.startsWith('data:') ? '' : finalPrintUrl,
        };
        delete snapshotSpecs.originalImage;
        if (snapshotSpecs.uploadedImage && snapshotSpecs.uploadedImage.startsWith('data:')) {
          snapshotSpecs.uploadedImage = finalImageUrl;
        }
        if (Array.isArray(snapshotSpecs.layers)) {
          snapshotSpecs.layers = snapshotSpecs.layers.map((l: any) => {
            const cleanLayer = { ...l };
            delete cleanLayer.originalFile;
            return cleanLayer;
          });
        }

        // Tạo sản phẩm snapshot lưu trữ thông số thiết kế cho xưởng in
        const { data: customProduct, error: customProdErr } = await supabaseAdmin
          .from('products')
          .insert({
            name: item.name,
            category: 'user_custom',
            price: item.price,
            description: JSON.stringify(snapshotSpecs),
            technical_specs: snapshotSpecs,
            image_url: safeProductImageUrl,
            stock: 1,
            is_available: false, // Ẩn khỏi trang mua sắm công khai
          })
          .select('id')
          .single();

        if (!customProdErr && customProduct) {
          finalProductId = customProduct.id;
        } else {
          console.error('Không thể tạo snapshot cho ly custom:', customProdErr);
        }
      }

      orderItemsToInsert.push({
        order_id: order.id,
        product_id: finalProductId,
        quantity: item.quantity,
        price: item.price,
        status: 'pending',
      });
    }

    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsErr) {
      console.error('Lỗi khi chèn chi tiết order_items:', itemsErr);
      // Xóa đơn hàng master để đảm bảo tính toàn vẹn (không có đơn hàng rỗng)
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return { 
        success: false, 
        error: 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.' 
      };
    }

    // 9. Revalidate cache safely
    try {
      revalidatePath('/orders');
      revalidatePath('/admin/orders');
    } catch (e) {
      console.warn('revalidatePath warning:', e);
    }

    return { 
      success: true, 
      orderId: order.id,
      total: calculatedTotal 
    };

  } catch (error: any) {
    console.error('Lỗi kỹ thuật trong processCheckout:', error);
    return { 
      success: false, 
      error: 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.' 
    };
  }
}
