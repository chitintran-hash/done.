const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/InteractiveFlashMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. User Location Marker
content = content.replace(/background:\s*#7C6FE6;/g, 'background: #006EE9;');
content = content.replace(/rgba\(124,\s*111,\s*230,\s*0\.35\)/g, 'rgba(0, 110, 233, 0.35)');
content = content.replace(/rgba\(124,\s*111,\s*230,\s*0\.5\)/g, 'rgba(0, 110, 233, 0.5)');

// 2. Temp Address Pin
content = content.replace(/background:\s*#68415F;/g, 'background: #006EE9;');
content = content.replace(/border-top:\s*7px\s*solid\s*#68415F;/g, 'border-top: 7px solid #006EE9;');

// 3. Group Room Markers (#E8A0FF, ring #000181 if selected)
content = content.replace(
  /background:\s*\$\{isSelected\s*\?\s*'#68415F'\s*:\s*'#A15C78'\};/g,
  "background: #E8A0FF; color: #000181; border: ${isSelected ? '3px solid #000181' : '3px solid #FFFFFF'};"
);
content = content.replace(
  /box-shadow:\s*0\s*8px\s*20px\s*rgba\(161,\s*92,\s*120,\s*0\.45\);/g,
  "box-shadow: ${isSelected ? '0 0 0 3px #000181, 0 8px 20px rgba(0, 1, 129, 0.35)' : '0 8px 20px rgba(232, 160, 255, 0.45)'};"
);
content = content.replace(
  /border-top:\s*7px\s*solid\s*\$\{isSelected\s*\?\s*'#68415F'\s*:\s*'#A15C78'\};/g,
  "border-top: 7px solid ${isSelected ? '#000181' : '#E8A0FF'};"
);

// 4. Pickup Point Markers (#83E7FF, ring #000181 if selected)
content = content.replace(
  /background:\s*#E58E72;/g,
  "background: #83E7FF; color: #000181;"
);
content = content.replace(
  /border:\s*2\.5px\s*solid\s*#FFFCF8;/g,
  "border: ${isSelected ? '3px solid #000181' : '2.5px solid #FFFFFF'};"
);
content = content.replace(
  /border-top:\s*6px\s*solid\s*#E58E72;/g,
  "border-top: 6px solid ${isSelected ? '#000181' : '#83E7FF'};"
);

// 5. Popup Buttons
content = content.replace(
  /background:\s*linear-gradient\(135deg,\s*#68415F,\s*#C77C86\);/g,
  "background: #006EE9;"
);
content = content.replace(
  /background:\s*#211A22;\s*color:\s*#ffffff;/g,
  "background: #006EE9; color: #ffffff;"
);

// 6. Sidebar styling & filters
// City filter active
content = content.replace(
  /selectedCity === c\.id\s*\?\s*'bg-\[#68415F\] text-white border-\[#68415F\] shadow-sm'\s*:\s*'bg-\[#FFFCF8\] text-\[#352B32\] hover:bg-\[#FFF8F1\] border-\[#EADFE4\]'/g,
  "selectedCity === c.id ? 'bg-[#D0FFA4] text-[#000181] border-[#000181] shadow-xs font-black' : 'bg-white text-[#000181] hover:bg-[#EFFBFF] border-[#E6E6EE]'"
);

// Area filter active
content = content.replace(
  /selectedArea === ar\.id\s*\?\s*'bg-\[#F2E8F0\] text-\[#68415F\] border-\[#D8BCCB\] shadow-xs'\s*:\s*'bg-\[#FFFCF8\] text-\[#352B32\] hover:bg-\[#FFF8F1\] border-\[#EADFE4\]'/g,
  "selectedArea === ar.id ? 'bg-[#D0FFA4] text-[#000181] border-[#000181] shadow-xs font-black' : 'bg-white text-[#000181] hover:bg-[#EFFBFF] border-[#E6E6EE]'"
);

// Pin type filter active
content = content.replace(
  /pinTypeFilter === t\.id\s*\?\s*'bg-\[#FFFCF8\] text-\[#68415F\] shadow-xs'\s*:\s*'text-\[#756871\] hover:text-\[#211A22\]'/g,
  "pinTypeFilter === t.id ? 'bg-[#D0FFA4] text-[#000181] shadow-xs font-black' : 'text-[#53536A] hover:text-[#000181]'"
);

// Radius filter active
content = content.replace(
  /selectedRadius === r\.val\s*\?\s*'bg-\[#68415F\] text-white border-\[#68415F\] shadow-xs'\s*:\s*'bg-\[#FFFCF8\] text-\[#756871\] hover:bg-\[#FFF8F1\] border-\[#EADFE4\]'/g,
  "selectedRadius === r.val ? 'bg-[#D0FFA4] text-[#000181] border-[#000181] shadow-xs font-black' : 'bg-white text-[#53536A] hover:bg-[#EFFBFF] border-[#E6E6EE]'"
);

// Sidebar room card selected
content = content.replace(
  /isSelected\s*\?\s*'border-\[#68415F\] ring-2 ring-\[#68415F\]\/20 bg-\[#F2E8F0\]\/30'\s*:\s*'border-\[#EADFE4\] hover:border-\[#D8CDD3\]'/g,
  "isSelected ? 'border-[#83E7FF] ring-2 ring-[#006EE9]/30 bg-[#EAF7FF]' : 'border-[#E6E6EE] hover:border-[#83E7FF] bg-white'"
);

// Buttons in sidebar card
content = content.replace(
  /bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] text-white/g,
  "bg-[#006EE9] hover:bg-[#000181] text-white"
);
content = content.replace(
  /bg-\[#FFF8F1\] hover:bg-\[#F2E8F0\] text-\[#68415F\] border border-\[#EADFE4\]/g,
  "bg-white hover:bg-[#EFFBFF] text-[#000181] border border-[#000181]"
);

// Map Legend
content = content.replace(/bg-\[#7C6FE6\]/g, 'bg-[#006EE9]');
content = content.replace(/bg-\[#A15C78\]/g, 'bg-[#E8A0FF]');
content = content.replace(/bg-\[#E58E72\]/g, 'bg-[#83E7FF]');
content = content.replace(/bg-\[#C58B52\]/g, 'bg-[#D0FFA4]');

// Replaces general surfaces and texts
content = content.replace(/#FFFCF8/g, '#FFFFFF');
content = content.replace(/#EADFE4/g, '#E6E6EE');
content = content.replace(/#756871/g, '#53536A');
content = content.replace(/#211A22/g, '#000181');
content = content.replace(/#352B32/g, '#000181');
content = content.replace(/#3A2438/g, '#000181');
content = content.replace(/#FFF8F1/g, '#FCFCF7');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Updated InteractiveFlashMap.tsx successfully.');
