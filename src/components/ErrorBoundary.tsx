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
        <div className="min-h-screen bg-[#FCFCF7] flex items-center justify-center p-6 text-center animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-[#E6E6EE] p-8 sm:p-10 max-w-md w-full shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#EFFBFF] text-[#006EE9] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#006EE9]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#006EE9] tracking-widest block">
                SỰ CỐ HỆ THỐNG
              </span>
              <h1 className="text-xl font-black text-[#000181] tracking-tight">
                FLASHGROUP GẶP SỰ CỐ
              </h1>
              <p className="text-xs text-[#53536A] leading-relaxed">
                Vui lòng thử tải lại trang. Nếu sự cố vẫn tiếp diễn, bạn có thể quay về trang chủ để tiếp tục khám phá.
              </p>
            </div>

            {/* Development-only error inspection */}
            {import.meta.env.DEV && this.state.error && (
              <div className="p-3 bg-[#F6F7FB] rounded-xl border border-[#E6E6EE] text-left overflow-x-auto max-h-40">
                <p className="text-[11px] font-mono text-rose-700 font-bold">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#006EE9] hover:bg-[#000181] text-white font-black text-xs transition shadow-md shadow-[#006EE9]/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TẢI LẠI</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl bg-transparent hover:bg-[#E8A0FF] text-[#000181] border-[1.5px] border-[#000181] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#000181]" />
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
