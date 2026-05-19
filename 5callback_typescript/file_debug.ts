console.log('Start');
import * as fs from 'fs';
const filename: string = 'sampl.txt';

// The callback pattern here is: (err, data) => { ... }
fs.readFile(filename, 'utf8', (err: Error | null, data: string): void => {
  console.log('1. Entered callback');

  if (err) {
    console.log('2. Detected Error');
    console.error('wrong File');
    // Remove 'return' here to see the problem happen
  } else {
    console.log('2. No Error');
    console.log(data);
  }

  // Pretend you have processing code here
  console.log('3. Processing data...');

  // This line will crash if data is undefined and you try to use it
  console.log(data.length);
});
console.log('End');
