import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Không Tìm Thấy Sản Phẩm | Cupfy',
      description: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh trên Cupfy.space.',
    };
  }

  const title = `${product.name} Đẹp, Thiết Kế Tối Giản | Cupfy`;
  const description = product.description && product.description.length > 30 && !product.description.startsWith('{')
    ? product.description
    : `Khám phá ${product.name} tại Cupfy với thiết kế tối giản, phù hợp sử dụng hằng ngày. Xem thông tin sản phẩm và đặt mua trực tuyến.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `https://www.cupfy.space/products/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.cupfy.space/products/${product.id}`,
      siteName: 'Cupfy',
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: product.image_url || 'https://www.cupfy.space/icon.jpg',
          width: 800,
          height: 800,
          alt: `${product.name} chính hãng Cupfy`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Schema.org Structured Data (Phần 5: Product, Offer, BreadcrumbList)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image_url],
    description: product.description || `Sản phẩm ${product.name} chính hãng tại Cupfy.space.`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Cupfy',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.cupfy.space/products/${product.id}`,
      priceCurrency: 'VND',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Cupfy',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://www.cupfy.space',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cửa hàng',
        item: 'https://www.cupfy.space/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://www.cupfy.space/products/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
