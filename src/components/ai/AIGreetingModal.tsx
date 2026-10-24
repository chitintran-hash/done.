'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, Loader2, Copy, Heart, Coffee, Briefcase, Laugh, GraduationCap } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface AIGreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'slogan' | 'greeting';
  onSelect: (text: string) => void;
}

export default function AIGreetingModal({
  isOpen,
  onClose,
  initialType = 'greeting',
  onSelect,
}: AIGreetingModalProps) {
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  const [type, setType] = useState<'slogan' | 'greeting'>(initialType);
  const [occasion, setOccasion] = useState('birthday');
  const [tone, setTone] = useState('dễ thương');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const occasions = type === 'greeting'
    ? [
        { id: 'birthday', label: isEn ? 'Birthday 🎂' : 'Sinh nhật 🎂' },
        { id: 'anniversary', label: isEn ? 'Anniversary / Love ❤️' : 'Kỷ niệm yêu nhau ❤️' },
        { id: 'graduation', label: isEn ? 'Graduation 🎓' : 'Tốt nghiệp 🎓' },
        { id: 'thanks', label: isEn ? 'Thank You 💐' : 'Tri ân / Cảm ơn 💐' },
        { id: 'general', label: isEn ? 'Everyday Gift ✨' : 'Quà tặng thường ngày ✨' },
      ]
    : [
        { id: 'coffee', label: isEn ? 'Coffee & Tea ☕' : 'Cà phê & Trà ☕' },
        { id: 'work', label: isEn ? 'Work & Study 💻' : 'Làm việc & Học tập 💻' },
        { id: 'love', label: isEn ? 'Love & Sweet ❤️' : 'Tình yêu & Thả thính ❤️' },
        { id: 'funny', label: isEn ? 'Gen Z Humor 🤪' : 'Hài hước bá đạo 🤪' },
        { id: 'general', label: isEn ? 'Positive Energy 🌟' : 'Năng lượng tích cực 🌟' },
      ];

  const tones = [
    { id: 'dễ thương', label: isEn ? 'Cute & Sweet' : 'Dễ thương & Ngọt ngào' },
    { id: 'hài hước', label: isEn ? 'Funny & Playful' : 'Hài hước & Bắt trend' },
    { id: 'chân thành', label: isEn ? 'Heartfelt & Warm' : 'Chân thành & Sâu lắng' },
    { id: 'ngắn gọn', label: isEn ? 'Minimal & Elegant' : 'Ngắn gọn & Tinh tế' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch('/api/ai/slogan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          occasion,
          tone,
          keyword: keyword.trim(),
          language,
        }),
      });
      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('Failed to generate AI suggestions:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectText = (text: string) => {
    onSelect(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E8DFD8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#3A211E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFBF00] text-[#3A211E] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {type === 'greeting'
                  ? isEn
                    ? 'AI Greeting Card Writer'
                    : 'AI Viết Lời Chúc Thiệp'
                  : isEn
                  ? 'AI Cup Slogan Generator'
                  : 'AI Sáng Tạo Slogan In Ly'}
              </h3>
              <p className="text-xs text-[#E8DFD8]">
                {isEn ? 'Powered by Google Gemini 1.5' : 'Hỗ trợ bởi Google Gemini 1.5'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E8DFD8] p-1.5 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={() => {
              setType('greeting');
              setSuggestions([]);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'greeting'
                ? 'bg-white text-[#3A211E] shadow-xs'
                : 'text-[#765B52] hover:text-[#3A211E]'
            }`}
          >
            💌 {isEn ? 'Gift Card Message' : 'Lời chúc thiệp tặng'}
          </button>
          <button
            type="button"
            onClick={() => {
              setType('slogan');
              setSuggestions([]);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'slogan'
                ? 'bg-white text-[#3A211E] shadow-xs'
                : 'text-[#765B52] hover:text-[#3A211E]'
            }`}
          >
            ✨ {isEn ? 'Cup Slogan' : 'Slogan in lên ly'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Occasion / Topic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-2">
              {type === 'greeting' ? (isEn ? 'Occasion:' : 'Dịp tặng:') : (isEn ? 'Topic / Theme:' : 'Chủ đề ly:')}
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    occasion === o.id
                      ? 'bg-[#3A211E] text-white border-[#3A211E] shadow-xs scale-102'
                      : 'bg-white text-[#3A211E] border-[#E8DFD8] hover:border-[#FFBF00]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-2">
              {isEn ? 'Tone / Style:' : 'Phong cách:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-[#FFBF00] text-[#3A211E] border-[#FFBF00] shadow-xs'
                      : 'bg-white text-[#765B52] border-[#E8DFD8] hover:border-[#3A211E]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Optional */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-1.5">
              {isEn ? 'Extra detail / Name (Optional):' : 'Tên người nhận hoặc chi tiết thêm (Tùy chọn):'}
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={isEn ? 'E.g., For my girlfriend Linh, likes cats...' : 'Ví dụ: Tặng bạn Linh thích mèo, kỷ niệm 1 năm...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-[#3A211E] hover:bg-[#2A1815] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FFBF00]" />
                <span>{isEn ? 'Gemini AI is generating...' : 'Gemini AI đang sáng tạo...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FFBF00]" />
                <span>{isEn ? 'Generate with Gemini AI ✨' : 'Tạo gợi ý với Gemini AI ✨'}</span>
              </>
            )}
          </button>

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <div className="pt-3 border-t border-[#E8DFD8] space-y-2.5">
              <span className="text-xs font-bold text-[#765B52] block">
                {isEn ? 'Click any card to select:' : 'Bấm vào câu bạn ưng ý để chọn:'}
              </span>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectText(s)}
                  className="p-3.5 rounded-2xl border border-[#E8DFD8] bg-[#FFF9E8]/50 hover:bg-[#FFF9E8] hover:border-[#FFBF00] transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <p className="text-xs sm:text-sm text-[#3A211E] font-medium leading-relaxed flex-1">
                    "{s}"
                  </p>
                  <button
                    type="button"
                    className="shrink-0 px-2.5 py-1 bg-[#3A211E] group-hover:bg-[#FFBF00] group-hover:text-[#3A211E] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>{isEn ? 'Use' : 'Chọn'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
