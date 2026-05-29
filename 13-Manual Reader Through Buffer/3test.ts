import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';

console.log('DEBUG - Raw Environment TXT:', process.env.TXT);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Bytes`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

// const bufferSize = (): number => {
//   const freeRAM = os.freemem();
//   console.log(`Free RAM on this system is ${(freeRAM / 1024 / 1024).toFixed(2)} MB`);
//   const buffer = 1024 * 1024;

//   if (freeRAM > 4 * oneMB) {
//     return 1 * oneMB; // 1MB chunks if > 4GB RAM free
//   } else if (freeRAM > 1 * oneMB) {
//     return 512 * 1024; // 512KB chunks if > 1GB RAM free
//   } else {
//     return 64 * 1024; // 64KB chunks if system is low on RAM
//   }
// };
const BUFFER_SIZE = 16;
const FileRelativePath = process.argv[2] || 'server.txt';
const FileAbsolutePath = path.resolve(FileRelativePath);

const searchTarget = process.env.TXT || '[ERROR]';
console.log('Processed Search Target:', searchTarget);

// 1. Start
async function main() {
  let fileHandle: fs.FileHandle | null = null;
  try {
    fileHandle = await fs.open(FileAbsolutePath, 'r');
    const overlapSize = Buffer.byteLength(searchTarget, 'utf8');
    if (overlapSize >= BUFFER_SIZE) {
      console.error(
        `Search target "${searchTarget}" (${overlapSize} bytes) is larger than or equal to the chunk buffer size (${BUFFER_SIZE} bytes).`,
      );
      process.exit(1);
    }

    const sharedBuffer = Buffer.alloc(BUFFER_SIZE);
    console.log(sharedBuffer); //16
    let leftover = '';
    let position = 0;
    let matchCount = 0;
    let count = 0;

    while (true) {
      const { bytesRead } = await fileHandle.read(sharedBuffer, 0, sharedBuffer.length, position);
      console.log('ByteRead:', bytesRead); //16

      if (bytesRead === 0) break;
      const dataString = sharedBuffer.toString('utf8', 0, bytesRead);
      console.log('DataString:', dataString); // input user search string like  Project
      console.log('DataString JSON:', JSON.stringify(dataString));
      const fullString = leftover + dataString;
      if (fullString.includes(searchTarget)) {
        console.log(`String matched with matchCount ${matchCount} with byteRead ${bytesRead}`);
        matchCount++;
      }
      leftover = fullString.slice(-overlapSize);
      count++;
      position = position + bytesRead;
    }
    console.log(`Total matchCount ${matchCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}
main();
