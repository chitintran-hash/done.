import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

const STYLE_PROMPTS: Record<string, string> = {
  chibi: 'cute chibi anime style sticker, thick clean die-cut white border, kawaii aesthetic, vibrant pastel colors, isolated on pure white background, vector art',
  watercolor: 'soft watercolor illustration sticker, gentle brush strokes, pastel colors, white border outline, isolated on pure white background',
  vintage: 'retro 90s vintage sticker, badge art, warm nostalgic colors, distressed edges, isolated on pure white background',
  pixel: '16-bit pixel art sticker, retro gaming icon, vibrant colors, clean sharp borders, isolated on pure white background',
  minimalist: 'minimalist clean line art sticker, modern simple geometric aesthetic, elegant, isolated on pure white background',
};

const PRESET_AI_STICKERS = [
  {
    name: 'Mèo Chibi Trà Sữa',
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&q=80',
  },
  {
    name: 'Hoa Hướng Dương Nụ Cười',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80',
  },
  {
    name: 'Cốc Cà Phê Chill',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { prompt: userPrompt, style = 'chibi' } = await req.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const styleModifier = STYLE_PROMPTS[style] || STYLE_PROMPTS.chibi;

    // 1. Dùng Gemini để dịch và tối ưu hóa Prompt tiếng Anh chuyên cho Sticker
    let optimizedPrompt = `${userPrompt}, ${styleModifier}`;

    const geminiTranslation = await callGemini({
      prompt: `Translate this sticker description to a concise English image prompt for a sticker: "${userPrompt}". Style is: ${styleModifier}. Return only the final English prompt, nothing else.`,
      temperature: 0.5,
      maxTokens: 100,
    });

    if (geminiTranslation && geminiTranslation.trim().length > 5) {
      optimizedPrompt = `${geminiTranslation.trim()}, ${styleModifier}`;
    }

    // 2. Tạo URL ảnh Sticker qua AI Engine (Pollinations AI với seed ngẫu nhiên cho tính độc bản)
    const cleanPrompt = encodeURIComponent(
      optimizedPrompt.replace(/[^\w\s,]/gi, ' ').substring(0, 200)
    );
    const randomSeed = Math.floor(Math.random() * 1000000);
    const aiImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;

    return NextResponse.json({
      success: true,
      sticker: {
        name: userPrompt.slice(0, 30),
        url: aiImageUrl,
        prompt: optimizedPrompt,
      },
    });
  } catch (error: any) {
    console.error('API /api/ai/sticker error:', error);
    const fallback = PRESET_AI_STICKERS[Math.floor(Math.random() * PRESET_AI_STICKERS.length)];
    return NextResponse.json({
      success: true,
      sticker: fallback,
      fallback: true,
    });
  }
}
