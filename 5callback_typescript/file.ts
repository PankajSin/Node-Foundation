console.log('Start');
import * as fs from 'fs';
const filename: string = 'sample.txt';

// The callback pattern here is: (err, data) => { ... }
fs.readFile(filename, 'utf8', (err: Error | null, data: string): void => {
  console.log('--- DEBUG START ---');
  console.log('Error exists?', err !== null); // true or false
  console.log('Error object:', err);
  console.log('Data type:', typeof data); // should be 'string' or 'undefined'
  console.log('Data value:', data);
  console.log('--- DEBUG END ---');
  if (err) {
    console.error('wrong File');
    return;
  } else {
    console.log(data);
  }
  const lines = data.split('\n');
  console.log(`Processing ${lines.length} lines...`);
});
console.log('End');
