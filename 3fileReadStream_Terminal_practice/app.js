import fs from 'fs';
import * as readline from 'node:readline';

const fileStream = fs.createReadStream('dest.txt');
const writeStream = fs.createWriteStream('write.txt', { flags: 'a' });

let filterKeyword = 'village';
let matchCount = 0;
let lineNumber = 1;

const rlFile = readline.createInterface({
  //this listen to streams
  input: fileStream,
  crlfDelay: Infinity, // node handle both window and linux
});

const rlKeyboard = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rlFile.on('line', (line) => {
  if (line.toLowerCase().includes(filterKeyword.toLowerCase())) {
    matchCount++;
    const logEntry = `[MATCH #${matchCount}] Line ${lineNumber}: ${line.trim()}`;

    console.log(logEntry);
    writeStream.write(logEntry + '\n');
  }
  lineNumber++;
});

rlKeyboard.on('line', (input) => {
  const newWord = input.trim();

  if (newWord.toLowerCase() === 'exit') {
    writeStream.end();
    process.exit(0);
  }

  filterKeyword = newWord;
  console.log(`Keyword changed! Now looking for: "${filterKeyword}"`);
});

rlFile.on('close', () => {
  console.log(`--- File reading finished. Total matches: ${matchCount} ---`);
});
