import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const __dirname = path.resolve();
const publicDir = path.join(__dirname, 'public');

// Create proper 192x192 PNG icon
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');

// Gradient background
const gradient192 = ctx192.createLinearGradient(0, 0, 192, 192);
gradient192.addColorStop(0, '#3b82f6');
gradient192.addColorStop(1, '#1d4ed8');
ctx192.fillStyle = gradient192;
ctx192.fillRect(0, 0, 192, 192);

// Weather icon (sun + cloud)
ctx192.fillStyle = '#fbbf24';
ctx192.beginPath();
ctx192.arc(96, 80, 35, 0, Math.PI * 2);
ctx192.fill();

// Cloud
ctx192.fillStyle = '#ffffff';
ctx192.beginPath();
ctx192.arc(70, 100, 25, 0, Math.PI * 2);
ctx192.arc(100, 100, 30, 0, Math.PI * 2);
ctx192.arc(130, 100, 25, 0, Math.PI * 2);
ctx192.fill();

// Clothing emoji hint
ctx192.font = '24px Arial';
ctx192.fillStyle = '#ffffff';
ctx192.textAlign = 'center';
ctx192.fillText('👕', 96, 150);

const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buffer192);

// Create proper 512x512 PNG icon
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');

// Gradient background
const gradient512 = ctx512.createLinearGradient(0, 0, 512, 512);
gradient512.addColorStop(0, '#3b82f6');
gradient512.addColorStop(1, '#1d4ed8');
ctx512.fillStyle = gradient512;
ctx512.fillRect(0, 0, 512, 512);

// Weather icon (sun + cloud)
ctx512.fillStyle = '#fbbf24';
ctx512.beginPath();
ctx512.arc(256, 210, 95, 0, Math.PI * 2);
ctx512.fill();

// Cloud
ctx512.fillStyle = '#ffffff';
ctx512.beginPath();
ctx512.arc(180, 270, 70, 0, Math.PI * 2);
ctx512.arc(256, 270, 85, 0, Math.PI * 2);
ctx512.arc(340, 270, 70, 0, Math.PI * 2);
ctx512.fill();

// Clothing emoji hint
ctx512.font = '64px Arial';
ctx512.fillStyle = '#ffffff';
ctx512.textAlign = 'center';
ctx512.fillText('👕', 256, 400);

const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buffer512);

console.log('✅ Created icon-192.png');
console.log('✅ Created icon-512.png');
console.log('Sizes:', buffer192.length, 'bytes (192x192)', buffer512.length, 'bytes (512x512)');
