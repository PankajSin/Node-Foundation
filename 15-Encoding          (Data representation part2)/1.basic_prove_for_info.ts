// 1. Convert text to a raw byte buffer using UTF-8
const textBuffer = Buffer.from('Hi 👋', 'utf-8');

// 2. View the Hex representation (Matches the chart above!)
console.log(textBuffer);
// Output: <Buffer 48 69 f0 9f 91 ab>

// 3. Check the physical size in bytes
console.log(textBuffer.length);
// Output: 6 (Even though the text look like 3 characters!)
