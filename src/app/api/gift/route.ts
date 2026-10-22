import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderName,
      recipientName,
      message,
      boxStyle = "classic",
      modelId = "glass_tall",
      cupColor,
      lidColor = "#FFBF00",
      layers = [],
      previewImage = "",
    } = body;

    // Validate inputs
    const cleanSender = String(senderName || "").trim().slice(0, 100);
    const cleanRecipient = String(recipientName || "").trim().slice(0, 100);
    const cleanMessage = String(message || "").trim().slice(0, 500);

    if (!cleanSender || !cleanRecipient || !cleanMessage) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tên người gửi, tên người nhận và lời nhắn." },
        { status: 400 }
      );
    }

    // Generate secure unguessable 24-character random token
    const token = "cupfy_" + crypto.randomBytes(12).toString("hex");

    const giftData = {
      token,
      sender_name: cleanSender,
      recipient_name: cleanRecipient,
      message: cleanMessage,
      box_style: ["classic", "love", "birthday"].includes(boxStyle) ? boxStyle : "classic",
      model_id: modelId,
      cup_color: cupColor || null,
      lid_color: lidColor,
      layers: Array.isArray(layers) ? layers : [],
      preview_image: previewImage || "",
      is_demo: true,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase products table as a demo_gift record
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: `Quà tặng Demo: ${cleanRecipient} từ ${cleanSender}`,
        category: "demo_gift",
        sku: token,
        price: 0,
        is_available: false,
        technical_specs: giftData,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating demo gift in Supabase:", error);
      return NextResponse.json(
        { error: "Không thể lưu quà tặng vào cơ sở dữ liệu: " + error.message },
        { status: 500 }
      );
    }

    // Determine site URL
    const origin = req.nextUrl.origin || "https://www.cupfy.space";

    return NextResponse.json({
      success: true,
      token,
      url: `${origin}/gift/${token}`,
      giftId: data?.id,
    });
  } catch (err: any) {
    console.error("API /api/gift error:", err);
    return NextResponse.json({ error: err.message || "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Thiếu token quà tặng" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, sku, technical_specs, created_at")
      .eq("category", "demo_gift")
      .eq("sku", token)
      .maybeSingle();

    if (error || !data || !data.technical_specs) {
      return NextResponse.json(
        { error: "Món quà không tồn tại hoặc liên kết đã hết hạn" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gift: data.technical_specs,
      createdAt: data.created_at,
    });
  } catch (err: any) {
    console.error("API GET /api/gift error:", err);
    return NextResponse.json({ error: err.message || "Lỗi máy chủ" }, { status: 500 });
  }
}
