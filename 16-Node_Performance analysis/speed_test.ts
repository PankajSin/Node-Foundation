// performance wise analysis -> in line5 we use await inside for loop
//  Node.js is forced to wait for the hard drive to finish writing before moving to the next number,
// This makes the code safe on memory, but very slow.n
// // import fs from 'node:fs/promises';

// (async () => {
//   console.time('timer');
//   const fileHandle = await fs.open('test.txt', 'w');
//   for (let i = 0; i < 500000; i++) {
//     await fileHandle.write(`${i} `);
//   }
//   console.timeEnd('timer');
// })();
// // through callback

// import fs from 'fs';

// (() => {
//   console.time('timer');
//   fs.open('test.txt', 'w', (err, fd) => {
//     // request os to open test.txt and create 'test.txt' in write-only mode so that we can modify its contents.
//     for (let i = 0; i < 500000; i++) {
//       fs.write(fd, `${i} `, null, (err) => {
//         if (err) throw err;
//       });
//     }
//   });

//   console.timeEnd('timer');
// })();

import fs from 'node:fs/promises';

(async () => {
  console.time('timer');
  const fileHandle = await fs.open('test.txt', 'w');
  const stream = fileHandle.createWriteStream();
  for (let i = 0; i < 5000000; i++) {
    const buffer = Buffer.from(` ${i} `);
    stream.write(buffer);
  }
  //  create internal buffer from ram,pack data into internal buffer ,when packed ,make system call to flush entire block onto harddrive
  console.timeEnd('timer');
})();
