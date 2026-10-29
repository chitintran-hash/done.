const fs = require('fs');
const path = require('path');

// 1. Clean App.tsx line 5318
const appPath = path.resolve('src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(
  /className="flex-1 bg-gradient-to-r from-\[#68415F\] to-\[#C77C86\] hover:from-\[#3A2438\] hover:to-\[#68415F\] text-white font-black py-2\.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1\.5 shadow-sm"/g,
  'className="flex-1 bg-[#006EE9] hover:bg-[#000181] text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"'
);
fs.writeFileSync(appPath, appContent, 'utf8');
console.log('✓ Cleaned App.tsx');

// 2. Clean InteractiveFlashMap.tsx
const mapPath = path.resolve('src/components/InteractiveFlashMap.tsx');
let mapContent = fs.readFileSync(mapPath, 'utf8');

mapContent = mapContent.replace(/#68415F/g, '#006EE9');
mapContent = mapContent.replace(/#E8957B/g, '#006EE9');
mapContent = mapContent.replace(/#F2E8F0/g, '#EFFBFF');
mapContent = mapContent.replace(/#D8CDD3/g, '#E6E6EE');
mapContent = mapContent.replace(/#D8BCCB/g, '#E6E6EE');
mapContent = mapContent.replace(/#C77C86/g, '#83E7FF');
mapContent = mapContent.replace(/#3A2438/g, '#000181');

fs.writeFileSync(mapPath, mapContent, 'utf8');
console.log('✓ Cleaned InteractiveFlashMap.tsx');
