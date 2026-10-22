import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import GiftUnboxingExperience, { GiftDataPayload } from "@/components/gift/GiftUnboxingExperience";
import { Gift, Home, ShoppingBag } from "lucide-react";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Món quà đặc biệt dành riêng cho bạn | Cupfy",
  description: "Trải nghiệm mở hộp quà chiếc ly độc bản được thiết kế riêng qua Cupfy.",
  robots: {
    index: false,
    follow: false,
  },
};

interface GiftPageProps {
  params: Promise<{ giftToken: string }>;
}

export default async function GiftRecipientPage({ params }: GiftPageProps) {
  const { giftToken } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch gift by token
  const { data: productRecord } = await supabase
    .from("products")
    .select("id, name, sku, technical_specs, created_at")
    .eq("category", "demo_gift")
    .eq("sku", giftToken)
    .maybeSingle();

  if (!productRecord || !productRecord.technical_specs) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 sm:p-10 rounded-[32px] border border-[#E8DFD8] shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-[#FFBF00]">
            <Gift className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-heading font-black text-[#171717]">
            Không tìm thấy món quà
          </h1>

          <p className="text-[#765B52] text-sm leading-relaxed">
            Liên kết quà tặng này có thể không chính xác hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn mà bạn bè đã gửi cho bạn nhé!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#3A211E] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#201817] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>

            <Link
              href="/products"
              className="px-6 py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold text-xs sm:text-sm hover:bg-[#FFD147] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Xem cửa hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const gift: GiftDataPayload = productRecord.technical_specs as GiftDataPayload;

  return <GiftUnboxingExperience gift={gift} />;
}
