const text = 'Hi 👋';

// 1. UTF-8 (Default Node.js buffer format)
const buf8 = Buffer.from(text, 'utf-8');
console.log('UTF-8 hex :', buf8);
console.log('UTF-8 size:', buf8.length, 'bytes\n');

// 2. UTF-16 (Written as 'utf16le' in Node.js)
const buf16 = Buffer.from(text, 'utf16le');
console.log('UTF-16 hex:', buf16);
console.log('UTF-16 size:', buf16.length, 'bytes\n');

// 3. UTF-32 (Node.js does not support UTF-32 natively because it wastes too much RAM!)
