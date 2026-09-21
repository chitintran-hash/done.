import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "CUPFY - Your cup. Your vibe. Your story.",
  description: "Nền tảng thương mại điện tử cho phép khách hàng tự thiết kế, cá nhân hóa, xem trước và đặt sản xuất chiếc ly của riêng mình.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased bg-[#FFF9E8] text-[#181818]`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
