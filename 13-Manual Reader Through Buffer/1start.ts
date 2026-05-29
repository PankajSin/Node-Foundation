import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';
import { StringDecoder } from 'string_decoder';

console.log('DEBUG - Raw Environment TXT:', process.env.TXT);

const totalRAM = (): string => {
  return (os.totalmem() / 1024 / 1024).toFixed(2);
};
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Bytes`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

const bufferSize = (): number => {
  const freeRAM = os.freemem();
  console.log(`Free RAM on this system is ${(freeRAM / 1024 / 1024).toFixed(2)} MB`);
  const buffer = 1024 * 1024;

  if (freeRAM > 4 * 1024 * buffer) {
    return 64 * 1024; // Fast Speed: 64KB chunks if > 4GB RAM free
  } else if (freeRAM > 1 * 1024 * buffer) {
    return 16 * 1024; // Normal Speed: 16KB chunks if > 1GB RAM free
  } else {
    return 1024; // Safe Speed: 1KB chunks if system is low on RAM
  }
};

const getMemoryInMb = (): string => {
  const memory: NodeJS.MemoryUsage = process.memoryUsage();
  return (memory.heapUsed / 1024 / 1024).toFixed(2);
};
console.log(`Initial Memory Usage : ${getMemoryInMb()}MB`);

const FileRelativePath = process.argv[2] || 'server.txt';
const FileAbsolutePath = path.resolve(FileRelativePath);
// console.log(FileAbsolutePath);
//Clarissa Harlowe What will be found

const searchTarget = process.env.TXT || '[ERROR]';
console.log('Processed Search Target:', searchTarget);

async function main() {
  let fileHandle: fs.FileHandle | null = null;
  let filedescriptor: number = 0;
  try {
    // Open the file and await the handle
    fileHandle = await fs.open(FileAbsolutePath, 'r');

    // filedescriptor = fileHandle.fd;
    // console.log(`The file descriptor variable: ${filedescriptor}`);
    const sizeFile = await fileHandle.stat();
    const totalSize = sizeFile.size;
    console.log(`Total File Size: ${formatBytes(totalSize)} (${totalSize} bytes)`);

    // Perform  file operations
    const buf = bufferSize();
    console.log(`Buffer size: ${formatBytes(buf)} (${buf} bytes)`);
    let position = 0;
    let matchCount = 0;
    // Calculate overlap protection based on the byte length of  target string
    const overlapSize = Buffer.byteLength(searchTarget, 'utf8');
    const sharedBuffer = Buffer.alloc(buf);
    const decoder = new StringDecoder('utf8');

    while (true) {
      const { bytesRead, buffer } = await fileHandle.read(
        sharedBuffer,
        0,
        sharedBuffer.length,
        position,
      ); // there is  an error ,understand it properly
      // Break out of the loop once  hit the absolute end of the 5GB file
      const dataString = decoder.write(sharedBuffer.subarray(0, bytesRead));
      if (dataString.includes(searchTarget)) {
        matchCount += dataString.split(searchTarget).length - 1;
        console.log(`[MATCH FOUND] Hit discovered at file position byte: ${formatBytes(position)}`);
      }
      if (bytesRead === buf) {
        // Rewind slightly by the overlap offset to catch split words at chunk boundaries
        position += bytesRead - overlapSize;
        // position += bytesRead ; this line gives wrong result
      } else {
        position += bytesRead; // Final chunk
      }
    }
    console.log(`\nScan complete! Total matches found for "${searchTarget}": ${matchCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    // Clean up resources
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}
main();
