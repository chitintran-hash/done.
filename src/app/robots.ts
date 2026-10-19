import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.cupfy.space';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/cart',
          '/checkout',
          '/orders/',
          '/profile/',
          '/api/',
          '/auth/',
          '/forgot-password',
          '/reset-password',
          '/login',
          '/register',
          '/order-confirmation',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/cart',
          '/checkout',
          '/orders/',
          '/profile/',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
