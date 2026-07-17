import { Buffer } from 'node:buffer';
import fs from 'fs';

const [, , src, dest] = process.argv;

async function bufferCopy(src: string, dest: string) {
  const content: string | any = fs.readFile(src, (err: any, data: any) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    return fs.writeFile(dest, data, 'utf-8', (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File written successfully');
    });
  });
}
bufferCopy(src!, dest!);

// import { readFile, writeFile } from 'fs/promises';

// async function copyFile(src: string, dest: string) {
//   // read entire file content
//   const content = await readFile(src);
//   // write that content somewhere else
//   return writeFile(dest, content);
// }

// // `src` is the first argument from cli, `dest` the second
// const [, , src, dest] = process.argv;

// // start the copy and handle the result
// copyFile(src!, dest!)
//   .then(() => console.log(`${src} copied into ${dest}`))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
