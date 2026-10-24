import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

const SYSTEM_INSTRUCTION = `
Bạn là "Cupfy AI" - Trợ lý tư vấn bán hàng & chăm sóc khách hàng thông minh, thân thiện và tận tâm của thương hiệu Cupfy (cupfy.space).
Nhiệm vụ của bạn là giải đáp thắc mắc của khách hàng về sản phẩm ly, quy trình thiết kế 3D, thanh toán, vận chuyển và bảo hành.

THÔNG TIN QUAN TRỌNG VỀ CUPFY:
1. SẢN PHẨM:
- Ly thủy tinh cao cấp: Dung tích 450ml - 500ml, nắp gỗ/nhựa tre kín khít, chịu nhiệt tốt, thích hợp uống cà phê, trà hoa quả.
- Ly nhựa 2 lớp kèm ống hút: Mẫu thiết kế trẻ trung, hiện đang là mẫu Demo sắp mở bán chính thức. Khách vẫn có thể trải nghiệm thiết kế 3D Studio bình thường!
- Bình giữ nhiệt & Ly sứ: Đang chuẩn bị ra mắt.
- Phụ kiện & Hộp quà tặng: Mua kèm hộp quà sang trọng lót rơm bảo vệ (+30.000đ), thiệp viết tay theo yêu cầu (+5.000đ), charm đính ly (+15.000đ).

2. CÔNG CỤ 3D STUDIO (/custom-cup):
- Cho phép khách hàng tự tay tải ảnh cá nhân, ảnh gia đình, thú cưng hoặc logo lên ly.
- Hơn 30+ font chữ Google Fonts tiếng Việt nghệ thuật, tùy chỉnh kích thước, màu sắc chữ, uốn cong.
- Bộ sưu tập sticker dễ thương có sẵn và tính năng "AI Vẽ Sticker" theo lời nhắc.
- Xoay 360 độ xem trước chân thực trong không gian 3 chiều trước khi đặt hàng.

3. VẬN CHUYỂN & THANH TOÁN:
- Phí giao hàng toàn quốc cố định: 30.000 VNĐ.
- Phương thức thanh toán: COD (Thanh toán tiền mặt khi nhận hàng), không cần chuyển khoản trước.
- Khách hàng ĐƯỢC KIỂM TRA HÀNG trước khi thanh toán cho nhân viên giao hàng.
- Thời gian giao hàng: Nội thành TP.HCM (1 - 2 ngày), các tỉnh thành khác (2 - 4 ngày).

4. BẢO HÀNH & ĐỔI TRẢ:
- Đổi trả miễn phí 1 đổi 1 trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc bị nứt vỡ do vận chuyển.

QUY TẮC TRẢ LỜI:
- Trả lời bằng giọng điệu lịch thiệp, ấm áp, ngắn gọn, dùng emoji sinh động (☕, 🥤, ✨, 🎁, 💖).
- Nếu khách hỏi tiếng Anh, hãy trả lời bằng tiếng Anh.
- Luôn khuyến khích khách hàng ghé thăm cửa hàng hoặc vào Studio 3D để trải nghiệm.
`;

// Smart local fallback for when GEMINI_API_KEY is not configured
function getFallbackAnswer(message: string, isEn: boolean): string {
  const lower = message.toLowerCase();

  if (lower.includes('ship') || lower.includes('vận chuyển') || lower.includes('phí') || lower.includes('giao')) {
    return isEn
      ? '📦 Shipping info: Nationwide delivery is 30,000 VND via Cash on Delivery (COD). You can inspect your package before paying! Delivery takes 1-2 days in HCMC and 2-4 days nationwide.'
      : '📦 Phí giao hàng toàn quốc là 30.000 VNĐ qua hình thức COD (nhận hàng thanh toán tiền mặt). Quý khách hoàn toàn được kiểm tra hàng trước khi nhận! Thời gian giao từ 1 - 2 ngày tại TP.HCM và 2 - 4 ngày với các tỉnh thành khác ạ. ✨';
  }

  if (lower.includes('ly nhựa') || lower.includes('chất liệu') || lower.includes('nhựa') || lower.includes('thủy tinh')) {
    return isEn
      ? '🥤 Material info: Cupfy provides premium food-safe double-wall tumblers and glass cups. Note that the double-wall plastic cup is currently a demo model for 3D customization and will be officially available for order soon!'
      : '🥤 Dạ hiện tại Cupfy có các dòng ly thủy tinh chịu nhiệt cao cấp và ly nhựa 2 lớp phong cách trẻ trung. Mẫu ly nhựa hiện đang là bản demo để khách trải nghiệm thiết kế 3D và sẽ chính thức mở bán trong thời gian tới ạ! ✨';
  }

  if (lower.includes('thiết kế') || lower.includes('tự làm') || lower.includes('studio') || lower.includes('custom')) {
    return isEn
      ? '🎨 You can customize your cup directly at /custom-cup! Upload your own photos, add artistic text, apply stickers, and preview in 3D 360-degree rotation.'
      : '🎨 Bạn có thể tự tay tạo mẫu ly độc bản tại mục 3D Studio (/custom-cup) nhé! Bạn có thể tải ảnh thú cưng, người thương, thêm chữ nghệ thuật và xoay 360 độ ngắm chiếc ly trước khi đặt hàng ạ! 💖';
  }

  if (lower.includes('đổi trả') || lower.includes('bảo hành') || lower.includes('vỡ') || lower.includes('lỗi')) {
    return isEn
      ? '🛡️ Warranty Policy: Free 1-to-1 replacement within 7 days for any manufacturing defects or shipping breakage.'
      : '🛡️ Chính sách Cupfy: Đổi mới miễn phí 1 đổi 1 trong 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc bị nứt vỡ trong quá trình vận chuyển. Bạn hoàn toàn yên tâm nhé! 🌿';
  }

  if (lower.includes('hộp quà') || lower.includes('quà tặng') || lower.includes('thiệp')) {
    return isEn
      ? '🎁 Gift Packaging: Cupfy offers premium gift packaging (+30,000đ) with protective filler straw and a complimentary handwritten greeting card upon request!'
      : '🎁 Dạ tại Cupfy bạn có thể mua kèm Hộp quà cao cấp lót rơm chống sốc (+30.000đ) và yêu cầu thiệp viết tay nhắn gửi lời chúc để tặng người thương rất ý nghĩa đó ạ! ✨';
  }

  return isEn
    ? "Hello! I'm Cupfy AI Assistant. How can I help you today? You can ask about our cup products, 3D custom studio, shipping fees, or gift boxes!"
    : 'Dạ Cupfy AI xin chào bạn! 🌸 Mình có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về các mẫu ly, cách thiết kế ly 3D, phí giao hàng hay đóng gói quà tặng nhé!';
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], language = 'vi' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const isEn = language === 'en';

    // Format conversation history for Gemini
    const conversationPrompt = history
      .map((h: any) => `${h.role === 'user' ? 'Khách hàng' : 'Cupfy AI'}: ${h.content}`)
      .concat(`Khách hàng: ${message}`)
      .join('\n');

    const prompt = `Lịch sử hội thoại gần đây:\n${conversationPrompt}\n\nHãy trả lời tin nhắn mới nhất của khách hàng một cách tự nhiên, hữu ích và ngắn gọn:`;

    // 1. Call Gemini 1.5 Flash
    const geminiReply = await callGemini({
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxTokens: 600,
    });

    if (geminiReply) {
      return NextResponse.json({
        success: true,
        reply: geminiReply,
        source: 'gemini',
      });
    }

    // 2. Fallback
    const fallback = getFallbackAnswer(message, isEn);
    return NextResponse.json({
      success: true,
      reply: fallback,
      source: 'fallback',
    });
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi xử lý tin nhắn.',
        reply: 'Dạ hệ thống AI đang cập nhật, bạn có thể nhắn trực tiếp qua hotline hoặc email tranchitin2006@gmail.com để được hỗ trợ tức thì nhé!',
      },
      { status: 500 }
    );
  }
}
