//  How to read and write stream line by line txt file
// how to read from keyboard

console.log('1.Script is running...');
import fs from 'fs';

// import readline from 'readline';
import * as readline from 'node:readline';

const fileStream = fs.createReadStream('dest.txt'); //this open the file as a stream
const writeStream = fs.createWriteStream('write.txt', { flags: 'a' });

const rl = readline.createInterface({
  //this listen to streams
  input: fileStream,
  crlfDelay: Infinity, // node handle both window and linux
});

const rlKeyboard = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('--- Script Running (Listening to dest.txt AND Keyboard) ---');

console.log('2.After rl');
// const now = new Date().toLocaleString();
let count = 1;
rl.on('line', (line) => {
  const now = new Date().toLocaleTimeString('en-GB');
  console.log(`3.Line:count:${count}${line} ${now}`);
  if (count <= 10) writeStream.write(line.trim() + '\n');
  count++;
});
rlKeyboard.on('line', (input) => {
  rlKeyboard.setPrompt('Type here > ');
  rlKeyboard.prompt();
  console.log(`[USER] You typed: "${input}" at ${new Date().toLocaleTimeString('en-GB')}`);
  if (!input.trim()) return; // Skip empty lines
  writeStream.write(input.trim() + '\n');

  if (input.toLowerCase() === 'exit') {
    writeStream.end();
    rlKeyboard.close();
    process.exit(0);
  }
});

// Cleanup when file is done
rl.on('close', () => {
  console.log('--- Finished reading dest.txt ---');
});
console.log('4.End');
