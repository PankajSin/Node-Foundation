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

import fs from 'fs';

(() => {
  console.time('timer');
  fs.open('test.txt', 'w', (err, fd) => {
    for (let i = 0; i < 500000; i++) {
      fs.write(fd);
    }
  });

  console.timeEnd('timer');
})();
