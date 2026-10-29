const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const stagingDir = path.join(rootDir, '_export_staging');
const zipPath = path.join(rootDir, 'flashgroup_source_code.zip');
const bundleJsonPath = path.join(rootDir, 'flashgroup_complete_bundle.json');
const restoreScriptPath = path.join(rootDir, 'restore_flashgroup.js');

console.log('--- FlashGroup Project Exporter ---');

if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const copyList = [
  'src',
  'public',
  'supabase',
  'docs',
  'index.html',
  'package.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'vercel.json',
  '.env.example',
  '.gitignore',
  'README.md'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      if (item.endsWith('.tsbuildinfo')) continue;
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const item of copyList) {
  const fullSrc = path.join(rootDir, item);
  if (fs.existsSync(fullSrc)) {
    copyRecursive(fullSrc, path.join(stagingDir, item));
  }
}
console.log('✓ Source files collected into staging.');

// 1. Create ZIP using PowerShell .NET ZipFile
try {
  const psCmd = `powershell.exe -NoProfile -NonInteractive -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${stagingDir.replace(/\\/g, '/')}', '${zipPath.replace(/\\/g, '/')}')"`;
  execSync(psCmd, { stdio: 'pipe' });
  const zipStat = fs.statSync(zipPath);
  console.log(`✓ Created ZIP: flashgroup_source_code.zip (${(zipStat.size / (1024 * 1024)).toFixed(2)} MB)`);
} catch (err) {
  console.warn('Zip creation note:', err.message);
}

// 2. Gather all files into a manifest / bundle JSON & self-extractor JS
function getAllFiles(dir, relativeTo = dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      res = res.concat(getAllFiles(full, relativeTo));
    } else {
      const rel = path.relative(relativeTo, full).replace(/\\/g, '/');
      const isBinary = /\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|pdf)$/i.test(item);
      res.push({
        path: rel,
        encoding: isBinary ? 'base64' : 'utf8',
        content: fs.readFileSync(full, isBinary ? 'base64' : 'utf8')
      });
    }
  }
  return res;
}

const bundledFiles = getAllFiles(stagingDir);
console.log(`✓ Total packaged files: ${bundledFiles.length}`);

// Write JSON bundle
fs.writeFileSync(bundleJsonPath, JSON.stringify(bundledFiles, null, 2), 'utf8');
console.log(`✓ Created JSON bundle: flashgroup_complete_bundle.json (${(fs.statSync(bundleJsonPath).size / (1024 * 1024)).toFixed(2)} MB)`);

// 3. Write self-extracting Node script restore_flashgroup.js
const selfExtractorCode = `/**
 * FlashGroup Self-Extracting Project Restorer
 * Automatically unpacks 100% of FlashGroup source files into current folder.
 * Usage: node restore_flashgroup.js
 */
const fs = require('fs');
const path = require('path');

const bundle = ${JSON.stringify(bundledFiles)};

console.log('Restoring FlashGroup codebase...');
for (const item of bundle) {
  const targetPath = path.resolve(process.cwd(), item.path);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  if (item.encoding === 'base64') {
    fs.writeFileSync(targetPath, Buffer.from(item.content, 'base64'));
  } else {
    fs.writeFileSync(targetPath, item.content, 'utf8');
  }
}
console.log(\`Successfully restored \${bundle.length} files!\`);
console.log('Next steps:');
console.log('1. npm install');
console.log('2. npm run dev');
`;

fs.writeFileSync(restoreScriptPath, selfExtractorCode, 'utf8');
console.log(`✓ Created self-extracting script: restore_flashgroup.js (${(fs.statSync(restoreScriptPath).size / (1024 * 1024)).toFixed(2)} MB)`);

// Clean staging directory
fs.rmSync(stagingDir, { recursive: true, force: true });
console.log('✓ Cleaned up staging directory.');
console.log('=== Packaging Complete! ===');
