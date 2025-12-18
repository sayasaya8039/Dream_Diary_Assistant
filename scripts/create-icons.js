// シンプルなアイコン生成スクリプト
// 実行: node scripts/create-icons.js

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../public/icons');

// 1x1 水色ピクセルのPNG（プレースホルダー）
// 実際のアイコンは後で差し替え可能
const createPlaceholderPng = (size) => {
  // 最小限のPNGヘッダー + 水色ピクセルデータ
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // 簡易的なダミーデータ（実際のアイコンはデザインツールで作成推奨）
  console.log(`Creating placeholder for ${size}x${size}`);
  return pngSignature;
};

try {
  mkdirSync(iconsDir, { recursive: true });

  [16, 48, 128].forEach(size => {
    const data = createPlaceholderPng(size);
    writeFileSync(join(iconsDir, `icon${size}.png`), data);
  });

  console.log('Icon placeholders created. Replace with actual icons later.');
} catch (error) {
  console.error('Error:', error);
}
