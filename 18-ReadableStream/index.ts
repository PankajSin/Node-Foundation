import fs from 'fs';

const readLine = fs.createReadStream('test.txt', { highWaterMark: 8 });
// console.log(readLine);
readLine.on('data', (chunk) => {
  //   console.log(chunk.length);  by Default 64KB but forcefully 8 bytes
  const small = chunk.toString();
  const cap = small.toUpperCase();
  console.log(cap);

  const hasNumber = /\d/.test(small);
  console.log(hasNumber);

  const matchesNumber = small.match(/\d+/g);
  console.log(matchesNumber);

  const position = small.search(/\d/);
  console.log(position); //position of first number
});
