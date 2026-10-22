"use client";

import React, { useState } from "react";
import GiftBoxVisual, { GiftBoxStyle } from "./GiftBoxVisual";
import GiftUnboxingExperience, { GiftDataPayload } from "./GiftUnboxingExperience";
import { CupColorOption, DesignLayer } from "@/components/studio/types";
import {
  X,
  Gift,
  Sparkles,
  Eye,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Heart,
  RotateCcw,
} from "lucide-react";

interface GiftCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  cupColor?: CupColorOption | null;
  lidColor?: string;
  layers: DesignLayer[];
  previewImage?: string;
}

const BOX_OPTIONS: { id: GiftBoxStyle; name: string; desc: string; ribbon: string; color: string }[] = [
  {
    id: "classic",
    name: "Cupfy Classic",
    desc: "Hộp vàng Cupfy với nơ nâu sang trọng",
    ribbon: "Nơ nâu",
    color: "#FFBF00",
  },
  {
    id: "love",
    name: "Cupfy Love",
    desc: "Hộp trắng tinh khôi với nơ nâu lãng mạn",
    ribbon: "Nơ nâu",
    color: "#FFFFFF",
  },
  {
    id: "birthday",
    name: "Cupfy Birthday",
    desc: "Hộp nâu chocolate với nơ vàng tiệc mừng",
    ribbon: "Nơ vàng",
    color: "#3A211E",
  },
];

export default function GiftCreationModal({
  isOpen,
  onClose,
  modelId,
  cupColor,
  lidColor,
  layers,
  previewImage,
}: GiftCreationModalProps) {
  const [selectedBox, setSelectedBox] = useState<GiftBoxStyle>("classic");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Live preview unboxing modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const currentGiftPayload: GiftDataPayload = {
    sender_name: senderName.trim() || "Người gửi giấu tên",
    recipient_name: recipientName.trim() || "Bạn của tôi",
    message: message.trim() || "Chúc bạn một ngày thật nhiều niềm vui và hạnh phúc cùng chiếc ly này!",
    box_style: selectedBox,
    model_id: modelId,
    cup_color: cupColor,
    lid_color: lidColor,
    layers,
    preview_image: previewImage,
  };

  const handleCreateGift = async () => {
    if (!senderName.trim()) {
      setErrorMsg("Vui lòng nhập Tên người gửi.");
      return;
    }
    if (!recipientName.trim()) {
      setErrorMsg("Vui lòng nhập Tên người nhận.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Vui lòng nhập Lời nhắn chúc mừng.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: senderName.trim(),
          recipientName: recipientName.trim(),
          message: message.trim(),
          boxStyle: selectedBox,
          modelId,
          cupColor,
          lidColor,
          layers,
          previewImage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo quà tặng.");
      }

      setCreatedUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi tạo quà tặng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleResetForm = () => {
    setCreatedUrl("");
    setSenderName("");
    setRecipientName("");
    setMessage("");
    setErrorMsg("");
  };

  return (
    <>
      {/* FULLSCREEN LIVE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto">
          <GiftUnboxingExperience
            gift={currentGiftPayload}
            isPreview={true}
            onClosePreview={() => setIsPreviewOpen(false)}
          />
        </div>
      )}

      {/* MAIN GIFT CREATION MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-[32px] border border-[#E8DFD8] shadow-2xl flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-[#E8DFD8] flex items-center justify-between bg-[#FFF9E8]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFBF00] flex items-center justify-center text-[#3A211E] shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-black text-[#3A211E]">
                    Tặng Quà Tương Tác
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider">
                    Demo
                  </span>
                </div>
                <p className="text-xs text-[#765B52]">
                  Tạo liên kết mở hộp quà 3D gửi đến bạn bè mà không phát sinh đơn hàng
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full text-[#765B52] hover:text-[#3A211E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {createdUrl ? (
              /* ========================================================
                 SUCCESS SCREEN: LINK GENERATED
                 ======================================================== */
              <div className="py-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-10 h-10" strokeWidth={3} />
                </div>

                <div>
                  <h3 className="text-2xl font-heading font-black text-[#171717] mb-1.5">
                    Bạn đã tạo món quà thành công!
                  </h3>
                  <p className="text-sm text-[#765B52] max-w-md mx-auto leading-relaxed">
                    Liên kết quà tặng đã sẵn sàng. Hãy sao chép và gửi qua Messenger, Zalo hoặc tin nhắn cho bạn bè để họ tự tay mở hộp quà nhé!
                  </p>
                </div>

                {/* Box Preview Thumbnail */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#FFF9E8] rounded-2xl border border-[#FFBF00]/40 text-xs font-bold text-[#3A211E]">
                  <span>Hộp quà đã chọn:</span>
                  <span className="px-2.5 py-1 rounded-full bg-white font-black border border-[#E8DFD8]">
                    {BOX_OPTIONS.find((b) => b.id === selectedBox)?.name}
                  </span>
                </div>

                {/* Link Box */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center gap-2 max-w-lg mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={createdUrl}
                    className="w-full bg-transparent font-mono text-xs text-[#3A211E] font-bold select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-[#FFBF00] hover:bg-[#FFD147] text-[#3A211E] rounded-xl font-extrabold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#3A211E] hover:bg-[#201817] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Xem món quà</span>
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="px-6 py-3 bg-white hover:bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8] rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#FFBF00]" />
                    <span>Tạo món quà khác</span>
                  </button>
                </div>

                {/* Reminder */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 max-w-md mx-auto text-[11px] text-[#765B52]">
                  Món quà Demo hoạt động vĩnh viễn trên mọi thiết bị mà không yêu cầu thanh toán hay đặt hàng.
                </div>
              </div>
            ) : (
              /* ========================================================
                 FORM: CHỌN HỘP & VIẾT LỜI NHẮN
                 ======================================================== */
              <>
                {/* BƯỚC 1: CHỌN MẪU HỘP QUÀ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-wider text-[#3A211E] flex items-center gap-1.5">
                      <span>Bước 1: Chọn mẫu hộp quà</span>
                      <span className="text-emerald-600 font-bold lowercase text-[11px]">(Miễn phí demo)</span>
                    </label>
                    <span className="text-[11px] text-[#765B52]">3 phong cách Cupfy</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BOX_OPTIONS.map((box) => {
                      const isSelected = selectedBox === box.id;
                      return (
                        <div
                          key={box.id}
                          onClick={() => setSelectedBox(box.id)}
                          className={`p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center text-center relative ${
                            isSelected
                              ? "border-[#FFBF00] bg-amber-50/60 shadow-md scale-[1.02]"
                              : "border-[#E8DFD8] bg-white hover:border-amber-300 hover:bg-[#FFF9E8]/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FFBF00] text-[#3A211E] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Mini Box Preview */}
                          <div className="w-16 h-16 my-2">
                            <GiftBoxVisual boxStyle={box.id} size="sm" />
                          </div>

                          <div className="font-heading font-black text-sm text-[#3A211E] mt-1">
                            {box.name}
                          </div>
                          <div className="text-[11px] text-[#765B52] leading-tight mt-0.5">
                            {box.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BƯỚC 2: VIẾT LỜI NHẮN */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#3A211E]">
                      Bước 2: Thông tin thiệp chúc mừng
                    </label>
                    <span className="text-[11px] text-[#765B52]">Hỗ trợ tiếng Việt có dấu</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3A211E] mb-1">
                        Tên người gửi *
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="VD: Tín"
                        maxLength={50}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm font-bold text-[#3A211E] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3A211E] mb-1">
                        Tên người nhận *
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="VD: Giang"
                        maxLength={50}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm font-bold text-[#3A211E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#3A211E]">
                        Lời nhắn cá nhân *
                      </label>
                      <span className={`text-[11px] font-mono ${message.length > 480 ? "text-rose-500 font-bold" : "text-[#765B52]"}`}>
                        {message.length}/500 ký tự
                      </span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Chúc mừng sinh nhật Giang! Mong chiếc ly xinh xắn này sẽ đồng hành cùng bạn và mang đến thật nhiều niềm vui mỗi ngày."
                      maxLength={500}
                      rows={3}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm text-[#3A211E] font-medium leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* Error Banner if any */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {errorMsg}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer (When not in success state) */}
          {!createdUrl && (
            <div className="p-4 sm:p-5 border-t border-[#E8DFD8] bg-[#FFF9E8]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Xem thử mở quà button */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF9E8] text-[#3A211E] border border-[#E8DFD8] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Eye className="w-4 h-4 text-[#FFBF00]" />
                <span>Xem thử mở quà</span>
              </button>

              {/* Tạo quà tặng button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleCreateGift}
                className="w-full sm:w-auto px-7 py-3 bg-[#FFBF00] hover:bg-[#FFD147] text-[#3A211E] rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#3A211E]" />
                    <span>ĐANG TẠO MÓN QUÀ...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 text-[#3A211E]" />
                    <span>TẠO QUÀ TẶNG</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
