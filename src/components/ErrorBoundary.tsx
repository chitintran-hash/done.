import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In development mode, console logs the real error
    console.error('[FlashGroup Global ErrorBoundary Caught]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center animate-fade-in font-sans">
          <div className="bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-8 sm:p-10 max-w-md w-full shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F2E8F0] text-[#68415F] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#A15C78]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#A15C78] tracking-widest block">
                SỰ CỐ HỆ THỐNG
              </span>
              <h1 className="text-xl font-black text-[#211A22] tracking-tight">
                FLASHGROUP GẶP SỰ CỐ
              </h1>
              <p className="text-xs text-[#756871] leading-relaxed">
                Vui lòng thử tải lại trang. Nếu sự cố vẫn tiếp diễn, bạn có thể quay về trang chủ để tiếp tục khám phá.
              </p>
            </div>

            {/* Development-only error inspection */}
            {import.meta.env.DEV && this.state.error && (
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFE4] text-left overflow-x-auto max-h-40">
                <p className="text-[11px] font-mono text-rose-700 font-bold">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#68415F] to-[#A15C78] hover:from-[#3A2438] hover:to-[#68415F] text-white font-black text-xs transition shadow-md shadow-[#68415F]/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TẢI LẠI</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#352B32] border border-[#EADFE4] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#756871]" />
                <span>VỀ TRANG CHỦ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
