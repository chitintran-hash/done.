import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    envVars[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Cupfy products...');
  
  // Xóa products cũ
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Lấy admin profile đầu tiên (nếu có) để gắn seller_id
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  const sellerId = profiles && profiles.length > 0 ? profiles[0].id : null;

  const products = [
    {
      name: "Cupfy Pink Glass",
      price: 89000,
      category: "glass",
      description: "Ly thủy tinh ánh hồng trong trẻo, phù hợp cho nước ép và detox.",
      image_url: "https://images.unsplash.com/photo-1544885896-01584c6c0b39?w=600&q=80",
      stock: 100,
      is_available: true,
      approval_status: 'active',
      seller_id: sellerId,
      technical_specs: {
        material: "Thủy tinh cao cấp",
        capacity: "350ml",
        color: "Hồng",
        is_customizable: false,
        collection: "pink-morning"
      }
    },
    {
      name: "Cupfy Morning Coffee Cup",
      price: 119000,
      category: "coffee",
      description: "Ly sứ tối giản phong cách Bắc Âu cho buổi sáng hoàn hảo.",
      image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
      stock: 50,
      is_available: true,
      approval_status: 'active',
      seller_id: sellerId,
      technical_specs: {
        material: "Sứ tráng men",
        capacity: "300ml",
        color: "Trắng",
        is_customizable: true,
        collection: "coffee-time"
      }
    },
    {
      name: "Cupfy Clear Straw Cup",
      price: 149000,
      category: "straw",
      description: "Ly có ống hút thủy tinh bảo vệ môi trường, tiện lợi cho trà sữa.",
      image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
      stock: 30,
      is_available: true,
      approval_status: 'active',
      seller_id: sellerId,
      technical_specs: {
        material: "Thủy tinh & Nắp tre",
        capacity: "500ml",
        color: "Trong suốt",
        is_customizable: true,
        collection: "summer-drink"
      }
    },
    {
      name: "Cupfy Sweet Milk Tea Cup",
      price: 179000,
      category: "milktea",
      description: "Ly cỡ lớn, chịu nhiệt tốt, chuyên dụng cho trà sữa trân châu.",
      image_url: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80",
      stock: 45,
      is_available: true,
      approval_status: 'active',
      seller_id: sellerId,
      technical_specs: {
        material: "Thủy tinh cường lực",
        capacity: "700ml",
        color: "Trong suốt",
        is_customizable: false,
        collection: "sweet-gift"
      }
    },
    {
      name: "Cupfy Minimal Office Cup",
      price: 199000,
      category: "office",
      description: "Ly văn phòng thiết kế thông minh chống đổ.",
      image_url: "https://images.unsplash.com/photo-1505075954930-b3b4f6b643fa?w=600&q=80",
      stock: 60,
      is_available: true,
      approval_status: 'active',
      seller_id: sellerId,
      technical_specs: {
        material: "Sứ & Silicone",
        capacity: "400ml",
        color: "Xám nhạt",
        is_customizable: true,
        collection: "study-desk"
      }
    }
  ];

  const { data, error } = await supabase.from('products').insert(products).select();
  
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded', data.length, 'products');
  }
}

seed();
