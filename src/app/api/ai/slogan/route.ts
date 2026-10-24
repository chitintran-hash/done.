import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

const FALLBACK_SLOGANS: Record<string, string[]> = {
  coffee: [
    'Uống một ngụm, tỉnh một ngày ☕',
    'Cà phê sáng cùng nụ cười em ✨',
    'Life happens, coffee helps ⚡',
    'Hít sâu, thở đều và uống cà phê 🌿',
    'Nạp năng lượng, bứt phá giới hạn 🚀',
  ],
  work: [
    'Work hard, drink harder 💻',
    'Đang cày deadline, xin đừng làm phiền 🛑',
    'Tập trung cao độ, bùng nổ doanh số 🎯',
    'Mỗi ngày một bước tiến lớn 🌟',
    'Vượt qua giới hạn chính mình 🔥',
  ],
  love: [
    'Uống nước cũng nhớ em ❤️',
    'Trà sữa ngọt ngào như ánh mắt anh 🧋',
    'Bên nhau mỗi ngày, bình yên từng phút 🌸',
    'You are my favorite notification 💌',
    'Giữ ấm tim em giữa ngày đông ❄️',
  ],
  funny: [
    'Uống nước cho đỡ cay cú 🤡',
    'Tiền đâu mà uống trà sữa hoài 💸',
    'Nước mắt tư bản rơi vào ly 🥲',
    'Xinh đẹp nhưng hay quên uống nước 💅',
    'Bình tĩnh và tiếp tục thở 🧘‍♂️',
  ],
  general: [
    'Your cup. Your vibe. Your story. ✨',
    'Mỗi ngày là một khởi đầu mới ☀️',
    'Stay hydrated, stay positive 💧',
    'Sống trọn từng khoảnh khắc tươi đẹp 🌈',
    'Yêu bản thân từ những điều giản dị 💖',
  ],
};

const FALLBACK_GREETINGS: Record<string, string[]> = {
  birthday: [
    'Chúc bạn tuổi mới thật nhiều niềm vui, luôn rạng rỡ và thành công rực rỡ nhé! 🎂🎉',
    'Mừng sinh nhật người bạn tuyệt vời! Mong chiếc ly xinh xắn này sẽ luôn nhắc bạn uống đủ nước mỗi ngày. 💖',
    'Tuổi mới chúc bạn kiếm thật nhiều tiền, bớt thức khuya và mãi giữ nụ cười tỏa nắng! 🎁',
  ],
  anniversary: [
    'Cảm ơn vì đã luôn ở bên và cùng anh đi qua những ngày tháng tuyệt vời nhất. Yêu em thật nhiều! ❤️',
    'Mỗi ngày bên em đều là một ngày đặc biệt. Mong chiếc ly này sẽ đồng hành cùng em mỗi sáng thức giấc. 🌸',
    'Happy Anniversary! Cùng nhau đi tiếp thật nhiều năm nữa nhé người thương của anh. 💑',
  ],
  graduation: [
    'Chúc mừng bạn đã hoàn thành xuất sắc chặng đường đại học! Chúc tương lai luôn rộng mở và thành công! 🎓✨',
    'Một cánh cửa mới đã mở ra. Chúc bạn luôn giữ vững ngọn lửa đam mê và tự tin bước đi trên con đường của mình! 🚀',
  ],
  thanks: [
    'Cảm ơn bạn vì đã luôn đồng hành và giúp đỡ tôi trong suốt thời gian qua. Trân quý tình bạn này rất nhiều! 💐',
    'Món quà nhỏ thay cho lời cảm ơn chân thành nhất từ tận đáy lòng. Chúc bạn luôn hạnh phúc và bình an! 🌿',
  ],
  general: [
    'Gửi tặng bạn một chút ngọt ngào và ấm áp cho ngày mới thật rực rỡ! Hãy luôn vui vẻ nhé. ☀️',
    'Mỗi lần nâng chiếc ly này lên, hãy nhớ rằng luôn có một người bạn đang cổ vũ và yêu thương bạn! ✨',
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'slogan', // 'slogan' | 'greeting'
      occasion = 'general',
      recipient = 'bạn bè',
      tone = 'dễ thương',
      keyword = '',
      language = 'vi',
    } = body;

    const isEn = language === 'en';

    // 1. Prompt Construction for Gemini
    let prompt = '';
    let systemInstruction = '';

    if (type === 'slogan') {
      systemInstruction =
        'Bạn là chuyên gia sáng tạo slogan in lên ly cá nhân hóa cho thương hiệu Cupfy. ' +
        'Hãy viết chính xác 5 câu slogan ngắn gọn (dưới 10 chữ), độc đáo, súc tích, ấn tượng. ' +
        'Chỉ trả về danh sách 5 câu, mỗi câu trên một dòng riêng, bắt đầu bằng gạch đầu dòng "- ". Không viết thêm lời giải thích nào khác.';

      prompt = `Chủ đề: ${occasion}. Phong cách / tông giọng: ${tone}. Từ khóa gợi ý: ${keyword || 'uống nước, cuộc sống, tình yêu'}. Ngôn ngữ mong muốn: ${isEn ? 'Tiếng Anh' : 'Tiếng Việt'}.`;
    } else {
      systemInstruction =
        'Bạn là trợ lý viết thiệp chúc mừng ý nghĩa cho thương hiệu quà tặng Cupfy. ' +
        'Hãy viết chính xác 3 lời chúc thiệp chân thành, chạm đến cảm xúc hoặc hóm hỉnh phù hợp với dịp tặng và người nhận. ' +
        'Mỗi lời chúc dài khoảng 1 - 3 câu. Chỉ trả về 3 lời chúc, mỗi lời chúc trên một dòng bắt đầu bằng "- ". Không viết thêm bất kỳ lời dẫn nào.';

      prompt = `Dịp tặng: ${occasion}. Người nhận: ${recipient}. Phong cách: ${tone}. Lời nhắn phụ: ${keyword || 'không'}. Ngôn ngữ: ${isEn ? 'Tiếng Anh' : 'Tiếng Việt'}.`;
    }

    // 2. Call Google AI Studio Gemini API
    const geminiText = await callGemini({
      prompt,
      systemInstruction,
      temperature: 0.8,
      maxTokens: 500,
    });

    // 3. Process AI Output
    if (geminiText) {
      const parsedLines = geminiText
        .split('\n')
        .map((line) => line.replace(/^[-*•\d\.\s]+/, '').trim())
        .filter((line) => line.length > 3 && !line.toLowerCase().startsWith('dưới đây'));

      if (parsedLines.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'gemini',
          suggestions: parsedLines.slice(0, 5),
        });
      }
    }

    // 4. Fallback if Gemini offline or no key
    const pool =
      type === 'slogan'
        ? FALLBACK_SLOGANS[occasion] || FALLBACK_SLOGANS.general
        : FALLBACK_GREETINGS[occasion] || FALLBACK_GREETINGS.general;

    return NextResponse.json({
      success: true,
      source: 'fallback',
      suggestions: pool,
    });
  } catch (error: any) {
    console.error('API /api/ai/slogan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Không thể tạo gợi ý AI.',
        suggestions: FALLBACK_SLOGANS.general,
      },
      { status: 500 }
    );
  }
}
