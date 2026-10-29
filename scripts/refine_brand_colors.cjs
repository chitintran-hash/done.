const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function getAllFiles(dir, exts = ['.tsx', '.ts', '.css']) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(item.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles(srcDir);
console.log(`Processing ${files.length} files...`);

let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Primary buttons and CTA
  content = content.replace(/\bbg-indigo-600 hover:bg-indigo-700\b/g, 'bg-[#006EE9] hover:bg-[#000181] text-white');
  content = content.replace(/\bbg-indigo-600\b/g, 'bg-[#006EE9]');
  content = content.replace(/\bhover:bg-indigo-700\b/g, 'hover:bg-[#000181]');
  content = content.replace(/\bbg-indigo-700\b/g, 'bg-[#000181]');
  content = content.replace(/\btext-indigo-600\b/g, 'text-[#006EE9]');
  content = content.replace(/\btext-indigo-700\b/g, 'text-[#000181]');
  content = content.replace(/\bborder-indigo-600\b/g, 'border-[#006EE9]');
  content = content.replace(/\bborder-indigo-500\b/g, 'border-[#006EE9]');
  content = content.replace(/\bfocus:ring-indigo-500\b/g, 'focus:ring-[#006EE9]');
  content = content.replace(/\bfocus:ring-indigo-600\b/g, 'focus:ring-[#006EE9]');
  content = content.replace(/\btext-indigo-500\b/g, 'text-[#006EE9]');
  content = content.replace(/\bbg-indigo-50\b/g, 'bg-[#EFFBFF]');
  content = content.replace(/\bbg-indigo-100\b/g, 'bg-[#FAF0FF]');

  // Emerald replacements (Price unlocks, success badges, savings)
  content = content.replace(/\bbg-emerald-600 hover:bg-emerald-700\b/g, 'bg-[#006EE9] hover:bg-[#000181] text-white');
  content = content.replace(/\bbg-emerald-600\b/g, 'bg-[#006EE9]');
  content = content.replace(/\bhover:bg-emerald-700\b/g, 'hover:bg-[#000181]');
  content = content.replace(/\btext-emerald-600\b/g, 'text-[#000181]');
  content = content.replace(/\btext-emerald-700\b/g, 'text-[#000181]');
  content = content.replace(/\bbg-emerald-50\b/g, 'bg-[#F4FFE8]');
  content = content.replace(/\bbg-emerald-100\b/g, 'bg-[#D0FFA4]/40');
  content = content.replace(/\bborder-emerald-200\b/g, 'border-[#D0FFA4]');
  content = content.replace(/\bborder-emerald-300\b/g, 'border-[#D0FFA4]');
  content = content.replace(/\bborder-emerald-500\b/g, 'border-[#D0FFA4]');

  // Purple / Violet (Social, Referral, Community)
  content = content.replace(/\bbg-purple-600 hover:bg-purple-700\b/g, 'bg-[#E8A0FF] hover:bg-[#D0FFA4] text-[#000181]');
  content = content.replace(/\bbg-purple-600\b/g, 'bg-[#E8A0FF] text-[#000181]');
  content = content.replace(/\btext-purple-600\b/g, 'text-[#000181]');
  content = content.replace(/\btext-purple-700\b/g, 'text-[#000181]');
  content = content.replace(/\bbg-purple-50\b/g, 'bg-[#FAF0FF]');
  content = content.replace(/\bbg-purple-100\b/g, 'bg-[#FAF0FF]');
  content = content.replace(/\bborder-purple-200\b/g, 'border-[#E8A0FF]');

  // Sky / Blue (Logistics, lockers, pickup)
  content = content.replace(/\bbg-sky-50\b/g, 'bg-[#EFFBFF]');
  content = content.replace(/\bbg-sky-100\b/g, 'bg-[#83E7FF]/30');
  content = content.replace(/\btext-sky-600\b/g, 'text-[#006EE9]');
  content = content.replace(/\btext-sky-700\b/g, 'text-[#000181]');
  content = content.replace(/\bborder-sky-200\b/g, 'border-[#83E7FF]');
  content = content.replace(/\bborder-sky-300\b/g, 'border-[#83E7FF]');

  // Clean up any double classes or contrast issues (never text-white on #D0FFA4, #E8A0FF, #83E7FF)
  content = content.replace(/text-white bg-\[#D0FFA4\]/g, 'text-[#000181] bg-[#D0FFA4]');
  content = content.replace(/bg-\[#D0FFA4\] text-white/g, 'bg-[#D0FFA4] text-[#000181]');
  content = content.replace(/text-white bg-\[#E8A0FF\]/g, 'text-[#000181] bg-[#E8A0FF]');
  content = content.replace(/bg-\[#E8A0FF\] text-white/g, 'bg-[#E8A0FF] text-[#000181]');
  content = content.replace(/text-white bg-\[#83E7FF\]/g, 'text-[#000181] bg-[#83E7FF]');
  content = content.replace(/bg-\[#83E7FF\] text-white/g, 'bg-[#83E7FF] text-[#000181]');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
    console.log(`Updated: ${path.relative(srcDir, file)}`);
  }
}

console.log(`Finished updating ${totalReplacements} files.`);
