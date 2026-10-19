import type { Metadata } from "next";
import { Be_Vietnam_Pro, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
});

const baloo2 = Baloo_2({
  weight: ['600', '700', '800'],
  variable: "--font-baloo-2",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cupfy.space"),
  title: {
    default: "Cupfy | Thiết Kế Ly Cá Nhân Hóa, In Ly Theo Yêu Cầu",
    template: "%s | Cupfy",
  },
  description: "Cupfy cung cấp ly thủy tinh, ly nhựa và dịch vụ thiết kế ly cá nhân hóa trực tuyến. Tự thêm tên, hình ảnh, logo và xem trước thiết kế 3D trước khi đặt hàng.",
  alternates: {
    canonical: "https://www.cupfy.space",
  },
  openGraph: {
    title: "Cupfy | Thiết Kế Ly Cá Nhân Hóa, In Ly Theo Yêu Cầu",
    description: "Cupfy cung cấp ly thủy tinh, ly nhựa và dịch vụ thiết kế ly cá nhân hóa trực tuyến. Tự thêm tên, hình ảnh, logo và xem trước thiết kế 3D trước khi đặt hàng.",
    url: "https://www.cupfy.space",
    siteName: "Cupfy",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/hero-slider-1.jpg",
        width: 1200,
        height: 630,
        alt: "Cupfy - Tự thiết kế chiếc ly mang dấu ấn riêng của bạn",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data: Organization & WebSite (Phần 5)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cupfy",
    "url": "https://www.cupfy.space",
    "logo": "https://www.cupfy.space/icon.jpg",
    "slogan": "Your cup. Your vibe. Your story.",
    "description": "Thương hiệu kinh doanh ly uống nước và ly cá nhân hóa trực tuyến tại Việt Nam.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VN",
    },
    "sameAs": [
      "https://facebook.com",
      "https://instagram.com",
      "https://tiktok.com"
    ]
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cupfy",
    "url": "https://www.cupfy.space",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.cupfy.space/products?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className={`${beVietnamPro.variable} ${baloo2.variable} font-sans antialiased bg-[#F7F6F2] text-[#201817]`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
