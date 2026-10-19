import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getPosts, checkIsAdmin } from '@/app/actions/posts';

export const metadata: Metadata = {
  title: {
    absolute: 'Giới Thiệu Cupfy | Thương Hiệu Ly Cá Nhân Hóa',
  },
  description: 'Tìm hiểu Cupfy, thương hiệu ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam, nơi bạn có thể tự thiết kế những chiếc ly mang dấu ấn riêng.',
  alternates: {
    canonical: 'https://www.cupfy.space/about',
  },
  openGraph: {
    title: 'Giới Thiệu Cupfy | Thương Hiệu Ly Cá Nhân Hóa',
    description: 'Tìm hiểu Cupfy, thương hiệu ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam, nơi bạn có thể tự thiết kế những chiếc ly mang dấu ấn riêng.',
    url: 'https://www.cupfy.space/about',
    siteName: 'Cupfy',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function AboutPage() {
  const posts = await getPosts('about');
  const isAdmin = await checkIsAdmin();

  // AboutPage Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Giới Thiệu Cupfy',
    url: 'https://www.cupfy.space/about',
    description: 'Tìm hiểu Cupfy, thương hiệu ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam, nơi bạn có thể tự thiết kế những chiếc ly mang dấu ấn riêng.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Cupfy',
      url: 'https://www.cupfy.space',
      logo: 'https://www.cupfy.space/icon.jpg',
      slogan: 'Your cup. Your vibe. Your story.',
      description: 'Thương hiệu kinh doanh ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam.',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient initialPosts={posts} isAdmin={isAdmin} />
    </>
  );
}
