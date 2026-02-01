import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const __dirname = path.resolve();
const publicDir = path.join(__dirname, 'public');

// Create proper 192x192 PNG icon
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');

// Gradient background (warm amber to represent outfit/warmth)
const gradient192 = ctx192.createLinearGradient(0, 0, 192, 192);
gradient192.addColorStop(0, '#f59e0b');
gradient192.addColorStop(1, '#d97706');
ctx192.fillStyle = gradient192;
ctx192.fillRect(0, 0, 192, 192);

// Coat emoji - centered and large
ctx192.font = '120px serif';
ctx192.textAlign = 'center';
ctx192.textBaseline = 'middle';
ctx192.fillText('🧥', 96, 100);

const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buffer192);

// Create proper 512x512 PNG icon
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');

// Gradient background (warm amber to represent outfit/warmth)
const gradient512 = ctx512.createLinearGradient(0, 0, 512, 512);
gradient512.addColorStop(0, '#f59e0b');
gradient512.addColorStop(1, '#d97706');
ctx512.fillStyle = gradient512;
ctx512.fillRect(0, 0, 512, 512);

// Coat emoji - centered and large
ctx512.font = '320px serif';
ctx512.textAlign = 'center';
ctx512.textBaseline = 'middle';
ctx512.fillText('🧥', 256, 270);

const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buffer512);

console.log('✅ Created icon-192.png');
console.log('✅ Created icon-512.png');
console.log('Sizes:', buffer192.length, 'bytes (192x192)', buffer512.length, 'bytes (512x512)');
