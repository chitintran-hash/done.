import React, { useState } from 'react';

type Props = {
  onEnableLocalDemoMode: () => void;
};

export const SupabaseSetupScreen: React.FC<Props> = ({ onEnableLocalDemoMode }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const envSample = `VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-slate-900/90 border border-[#C7F000]/30 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-emerald-500/20">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              FlashGroup <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-[#C7F000]/30">Phase V4</span>
            </h1>
            <p className="text-sm text-slate-400">Kiến trúc Supabase Database + Authentication + Realtime Concurrency</p>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-8 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="text-base font-bold text-amber-300">Supabase chưa được cấu hình</h2>
            <p className="text-sm text-amber-200/80 mt-1">
              Hệ thống chưa tìm thấy biến môi trường <code className="bg-slate-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">VITE_SUPABASE_URL</code> và <code className="bg-slate-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> trong file <code className="font-mono text-xs text-white bg-slate-950 px-1 py-0.5 rounded">.env</code>.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6 mb-8 text-sm text-slate-300">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Hướng dẫn 4 bước kích hoạt Supabase Live Database:
          </h3>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-emerald-400 mb-1">Bước 1: Tạo dự án trên Supabase</div>
              <p className="text-slate-400 text-xs">
                Truy cập <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-300 underline font-semibold">supabase.com</a>, đăng nhập và chọn <strong>New Project</strong> (khu vực Singapore hoặc gần nhất).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-emerald-400 mb-1">Bước 2: Chạy Database Schema & Seed Data</div>
              <p className="text-slate-400 text-xs mb-2">
                Mở <strong>SQL Editor</strong> trong Supabase Dashboard và thực thi tuần tự 2 file đã tạo sẵn trong mã nguồn:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-emerald-300 flex items-center justify-between">
                  <span>📄 supabase/schema.sql</span>
                  <span className="text-[10px] text-slate-500">Bảng & RPC lock</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-emerald-300 flex items-center justify-between">
                  <span>🌱 supabase/seed.sql</span>
                  <span className="text-[10px] text-slate-500">Phòng Dâu 19/20</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-emerald-400 mb-1 flex items-center justify-between">
                <span>Bước 3: Cấu hình file .env</span>
                <button
                  onClick={() => copyToClipboard(envSample, 1)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded transition"
                >
                  {copiedIndex === 1 ? '✓ Đã chép' : 'Sao chép mẫu'}
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-2">
                Tạo file <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">.env</code> tại thư mục gốc của project (ngang hàng với package.json) và điền URL & Anon Key từ <em>Project Settings → API</em>:
              </p>
              <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                {envSample}
              </pre>
              <p className="text-[11px] text-amber-300/80 mt-1.5 flex items-center gap-1">
                <span>🛡️</span> <strong>Cảnh báo bảo mật:</strong> Không bao giờ đặt <code className="font-mono text-red-300">SUPABASE_SERVICE_ROLE_KEY</code> ở frontend!
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-emerald-400 mb-1">Bước 4: Khởi động lại ứng dụng</div>
              <p className="text-slate-400 text-xs mb-1">Dừng terminal hiện tại và chạy lại lệnh:</p>
              <code className="block bg-slate-950 p-2 rounded text-xs font-mono text-white border border-slate-800">
                npm run dev
              </code>
            </div>
          </div>
        </div>

        {/* Explicit Local Demo Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Chưa có tài khoản Supabase ngay bây giờ? Bạn vẫn có thể trải nghiệm toàn bộ giao diện và kịch bản 19→20.
          </div>
          <button
            onClick={onEnableLocalDemoMode}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-95 whitespace-nowrap"
          >
            Chạy chế độ Demo Offline (Local Mode) →
          </button>
        </div>
      </div>
    </div>
  );
};
