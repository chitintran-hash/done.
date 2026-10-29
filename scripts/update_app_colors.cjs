const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Loading screen
content = content.replace(
  /<div className="min-h-screen bg-\[#FFFCF8\] p-6 max-w-7xl mx-auto space-y-6">/g,
  '<div className="min-h-screen bg-[#FCFCF7] p-6 max-w-7xl mx-auto space-y-6">'
);
content = content.replace(
  /<div className="h-64 bg-\[#EADFE4\]\/50 rounded-3xl w-full animate-pulse flex items-center justify-center">/g,
  '<div className="h-64 bg-[#E6E6EE]/50 rounded-3xl w-full animate-pulse flex items-center justify-center">'
);
content = content.replace(
  /<Loader2 className="w-8 h-8 text-\[#68415F\] animate-spin mx-auto" \/>/g,
  '<Loader2 className="w-8 h-8 text-[#006EE9] animate-spin mx-auto" />'
);
content = content.replace(
  /<p className="text-xs font-bold text-\[#756871\]">Đang đồng bộ dữ liệu FlashGroup\.\.\.<\/p>/g,
  '<p className="text-xs font-bold text-[#53536A]">Đang đồng bộ dữ liệu FlashGroup...</p>'
);

// 2. Hero Section
content = content.replace(
  /background:\s*'linear-gradient\(135deg,\s*#3A2438\s*0%,\s*#68415F\s*45%,\s*#C77C86\s*75%,\s*#F3B37A\s*100%\)',/g,
  "background: 'linear-gradient(135deg, #000181 0%, #003CCB 40%, #006EE9 70%, #83E7FF 100%)',"
);
content = content.replace(
  /<Zap className="w-96 h-96 text-\[#F3B37A\]" \/>/g,
  '<Zap className="w-96 h-96 text-[#83E7FF]/20 fill-[#83E7FF]/10" />'
);
content = content.replace(
  /bg-white\/15 backdrop-blur-md px-3\.5 py-1\.5 rounded-full text-xs font-bold text-\[#FFF8F1\] border border-white\/20/g,
  'bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/20'
);
content = content.replace(
  /<Sparkles className="w-4 h-4 text-\[#F3B37A\]" \/>/g,
  '<Sparkles className="w-4 h-4 text-[#D0FFA4]" />'
);
content = content.replace(
  /from-\[#FFF8F1\] via-\[#F3B37A\] to-\[#E8957B\]/g,
  'from-white via-[#83E7FF] to-[#D0FFA4]'
);
content = content.replace(
  /text-\[#FFF8F1\]\/90 border-t border-white\/15/g,
  'text-white/90 border-t border-white/15'
);
content = content.replace(
  /className="w-4 h-4 text-\[#F3B37A\]"/g,
  'className="w-4 h-4 text-[#D0FFA4]"'
);

// Hero CTA buttons (Requirement 11)
content = content.replace(
  /<CTAButton\s+variant="primary"\s+size="lg"\s+icon=\{ArrowRight\}\s+onClick=\{([^}]+)\}\s*>\s*KHÁM PHÁ PHÒNG GOM\s*<\/CTAButton>/g,
  `<button onClick={$1} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-[#D0FFA4] hover:bg-[#83E7FF] text-[#000181] shadow-lg shadow-black/20 transition cursor-pointer active:scale-98 uppercase"><span>KHÁM PHÁ PHÒNG GOM</span><ArrowRight className="w-5 h-5" /></button>`
);
content = content.replace(
  /<CTAButton\s+variant="secondary"\s+size="lg"\s+icon=\{Building2\}\s+onClick=\{([^}]+)\}\s*>\s*DÀNH CHO NHÀ CUNG CẤP\s*<\/CTAButton>/g,
  `<button onClick={$1} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-transparent hover:bg-[#E8A0FF] hover:text-[#000181] text-white border-2 border-white transition cursor-pointer active:scale-98 uppercase"><span>DÀNH CHO NHÀ CUNG CẤP</span><Building2 className="w-5 h-5" /></button>`
);

// 3. Discovery View Buttons (Tham gia phòng gom)
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] text-white shadow-\[#68415F\]\/20 cursor-pointer/g,
  'bg-[#006EE9] hover:bg-[#000181] text-white shadow-md shadow-[#006EE9]/20 cursor-pointer'
);

// 4. Group Room View Buttons
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] text-white font-black py-4 px-8 rounded-2xl transition shadow-xl shadow-\[#68415F\]\/30/g,
  'bg-[#006EE9] hover:bg-[#000181] text-white font-black py-4 px-8 rounded-2xl transition shadow-xl shadow-[#006EE9]/25'
);
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] text-white font-black py-3\.5 px-6 rounded-2xl transition shadow-lg shadow-\[#68415F\]\/30/g,
  'bg-[#006EE9] hover:bg-[#000181] text-white font-black py-3.5 px-6 rounded-2xl transition shadow-lg shadow-[#006EE9]/25'
);
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] disabled:opacity-50 text-white font-black py-2\.5 px-3 rounded-xl/g,
  'bg-[#006EE9] hover:bg-[#000181] disabled:opacity-50 text-white font-black py-2.5 px-3 rounded-xl'
);
content = content.replace(
  /bg-\[#F2E8F0\] text-\[#68415F\] border border-\[#D8CDD3\] font-bold py-2\.5 px-3 rounded-xl text-\[11px\] text-center truncate/g,
  'bg-[#D0FFA4] text-[#000181] border border-[#000181]/20 font-black py-2.5 px-3 rounded-xl text-[11px] text-center truncate'
);

// 5. Checkout View Submit Button
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition shadow-xl shadow-\[#68415F\]\/30/g,
  'bg-[#006EE9] hover:bg-[#000181] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition shadow-xl shadow-[#006EE9]/25'
);

// 6. Price Ladder in GroupRoomView (Requirement 17)
// Replace the old ladder styling with:
// CURRENT TIER: bg-[#D0FFA4] border-2 border-[#000181] text-[#000181]
// NEXT TIER: bg-[#F8E9FF] border-2 border-[#E8A0FF] text-[#000181]
// AVAILABLE TIER: bg-[#EAF6FF] border border-[#83E7FF]
// LOCKED TIER: bg-[#F6F7FB] border border-[#E6E6EE]
const oldLadderRegex = /<div\s+key=\{idx\}\s+className=\{`rounded-2xl p-4 border transition-all text-center relative \$\{[^}]+\}`\}>[\s\S]+?<\/div>\s*<\/div>/;
const newLadderSnippet = `<div
                    key={idx}
                    className={\`rounded-2xl p-4 border transition-all text-center relative \${
                      isFinalPriceLock || isCurrent
                        ? 'bg-[#D0FFA4] border-2 border-[#000181] text-[#000181] shadow-md ring-2 ring-[#000181]/15'
                        : !isUnlocked && nextTier && nextTier.nextPrice === tier.price
                        ? 'bg-[#F8E9FF] border-2 border-[#E8A0FF] text-[#000181] shadow-xs'
                        : isUnlocked
                        ? 'bg-[#EAF6FF] border border-[#83E7FF] text-[#000181]'
                        : 'bg-[#F6F7FB] border border-[#E6E6EE] text-[#53536A] opacity-70'
                    }\`}
                  >
                    {isFinalPriceLock ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#000181] text-[#D0FFA4] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        FINAL PRICE
                      </span>
                    ) : isCurrent ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#000181] text-[#D0FFA4] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        CURRENT TIER
                      </span>
                    ) : !isUnlocked && nextTier && nextTier.nextPrice === tier.price ? (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E8A0FF] text-[#000181] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        NEXT TIER
                      </span>
                    ) : null}

                    <div className="text-xs font-bold mb-1">
                      {tier.maxQuantity
                        ? \`\${tier.minQuantity} – \${tier.maxQuantity} \${room.unit}\`
                        : \`\${tier.minQuantity}+ \${room.unit}\`}
                    </div>
                    <div
                      className={\`text-lg font-black \${
                        isFinalPriceLock || isCurrent
                          ? 'text-[#000181]'
                          : !isUnlocked && nextTier && nextTier.nextPrice === tier.price
                          ? 'text-[#000181]'
                          : isUnlocked
                          ? 'text-[#006EE9]'
                          : 'text-[#53536A]'
                      }\`}
                    >
                      {formatVND(tier.price)}
                    </div>

                    <div className="mt-2 text-[11px] font-bold flex items-center justify-center space-x-1">
                      {isFinalPriceLock ? (
                        <span className="text-[#000181] flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mức giá chốt
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[#000181] flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mức hiện tại
                        </span>
                      ) : !isUnlocked && nextTier && nextTier.nextPrice === tier.price ? (
                        <span className="text-[#000181] flex items-center gap-1 font-bold">
                          ★ Nấc tiếp theo
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[#006EE9] flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006EE9]" /> Đã mở khóa
                        </span>
                      ) : (
                        <span className="text-[#53536A] flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3" /> Chưa mở
                        </span>
                      )}
                    </div>
                  </div>`;

if (oldLadderRegex.test(content)) {
  content = content.replace(oldLadderRegex, newLadderSnippet);
  console.log('✓ Replaced Price Ladder in App.tsx');
} else {
  console.log('Price ladder regex did not match, using fallback search.');
}

// 7. Progress Bar in GroupRoomView (Requirement 16)
content = content.replace(
  /className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"/g,
  'className="h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${percentFilled}%`, background: percentFilled >= 100 ? "#D0FFA4" : percentFilled >= 80 ? "linear-gradient(90deg, #83E7FF 0%, #D0FFA4 100%)" : "linear-gradient(90deg, #006EE9 0%, #83E7FF 100%)" }}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully updated App.tsx color system.');
