'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export default function AIChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  if (pathname === '/' || pathname.startsWith('/partner') || pathname.startsWith('/admin')) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isEn
        ? "Hello! I'm Cupfy AI. How can I assist you with your personalized cup, 3D design studio, or orders today? ✨"
        : 'Dạ Cupfy AI xin chào bạn! 🌸 Mình có thể giúp gì cho bạn về các mẫu ly, thiết kế 3D hoặc chính sách giao hàng hôm nay ạ? ✨',
      time: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = isEn
    ? [
        '📦 What is the shipping fee and delivery time?',
        '🎨 How to customize my cup in 3D studio?',
        '🥤 Tell me about the cup materials',
        '🎁 Do gift boxes come with cards?',
      ]
    : [
        '📦 Phí giao hàng & thời gian nhận hàng?',
        '🎨 Cách tự thiết kế ly 3D theo yêu cầu?',
        '🥤 Chất liệu và đặc tính các loại ly?',
        '🎁 Hộp quà tặng có kèm thiệp không?',
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          language,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (isEn
          ? "I'm sorry, I couldn't process that right now. Please try again!"
          : 'Dạ Cupfy AI đang bận một chút, bạn thử gửi lại tin nhắn nhé!');

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: isEn
            ? 'Connection interrupted. Please check your internet.'
            : 'Đã có lỗi kết nối. Bạn vui lòng thử lại nhé!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#3A211E] hover:bg-[#2A1815] text-white px-4 py-3.5 rounded-full shadow-[0_8px_30px_rgba(58,33,30,0.35)] transition-all transform hover:scale-105 active:scale-95 border-2 border-[#FFBF00]/40 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#FFBF00]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>
          <span className="text-sm font-bold tracking-wide">
            {isEn ? 'Ask Cupfy AI' : 'Hỏi Cupfy AI'}
          </span>
          <Sparkles className="w-4 h-4 text-[#FFBF00] animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E8DFD8] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#3A211E] text-white p-4 flex items-center justify-between border-b border-[#3A211E]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFBF00] text-[#3A211E] flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base flex items-center gap-1.5 text-white">
                  <span>Cupfy AI Concierge</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFBF00]" />
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#E8DFD8]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isEn ? 'Online • Google Gemini 1.5' : 'Trực tuyến • Google Gemini 1.5'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFF9E8]/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    m.role === 'user'
                      ? 'bg-[#3A211E] text-white'
                      : 'bg-[#FFBF00] text-[#3A211E]'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.role === 'user'
                      ? 'bg-[#3A211E] text-white rounded-tr-none'
                      : 'bg-white border border-[#E8DFD8] text-[#3A211E] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      m.role === 'user' ? 'text-white/60 text-right' : 'text-[#765B52]'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-[#FFBF00] text-[#3A211E] flex items-center justify-center text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#E8DFD8] p-3 rounded-2xl rounded-tl-none text-xs text-[#765B52] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3A211E]" />
                  <span>{isEn ? 'Cupfy AI is typing...' : 'Cupfy AI đang suy nghĩ...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-white border-t border-[#E8DFD8]/80">
            <div className="text-[10px] font-bold text-[#765B52] mb-1.5 px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFBF00]" />
              <span>{isEn ? 'Suggested questions:' : 'Gợi ý câu hỏi nhanh:'}</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-[#FFF9E8] hover:bg-[#FFBF00]/30 text-[#3A211E] border border-[#E8DFD8] shrink-0 font-medium transition-colors cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E8DFD8] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isEn ? 'Ask Cupfy AI anything...' : 'Nhập câu hỏi cho Cupfy AI...'}
              className="flex-1 px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-[#3A211E]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 bg-[#3A211E] hover:bg-[#2A1815] disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
