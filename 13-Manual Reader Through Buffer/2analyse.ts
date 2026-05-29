// same as app.ts but used for analysis
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';

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

// const bufferSize = (): number => {
//   const freeRAM = os.freemem();
//   console.log(`Free RAM on this system is ${(freeRAM/1024/1024).toFixed(2)} MB`);
//   const buffer = 1024 * 1024;

//   if (freeRAM > 4 * 1024 * buffer) {
//     return 64 * 1024; // Fast Speed: 64KB chunks if > 4GB RAM free
//   } else if (freeRAM > 1 * 1024 * buffer) {
//     return 16 * 1024; // Normal Speed: 16KB chunks if > 1GB RAM free
//   } else {
//     return 1024; // Safe Speed: 1KB chunks if system is low on RAM
//   }
// };
const bufferSize = (): number => {
  return 16;
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

    let leftoverString = '';
    let position = 0;
    let matchCount = 0;

    // Calculate overlap protection based on the byte length of  target string
    // const overlapSize = Buffer.byteLength(searchTarget, 'utf8');
    const sharedBuffer = Buffer.alloc(buf);

    while (true) {
      const { bytesRead } = await fileHandle.read(sharedBuffer, 0, sharedBuffer.length, position);

      if (bytesRead === 0) break;

      const dataString = sharedBuffer.toString('utf8', 0, bytesRead);

      // 1. CONCATENATION: Combine last chunk's tail with this chunk's fresh body
      const fullTextToScan = leftoverString + dataString;

      // 2. STAGE ANALYSIS: Check the combined text for keywords
      if (fullTextToScan.includes(searchTarget)) {
        // Count how many times the keyword appears inside this combined block
        const occurrences = fullTextToScan.split(searchTarget).length - 1;
        matchCount += occurrences;
        console.log(
          `[MATCH FOUND] Hit discovered near file position byte: ${formatBytes(position)}`,
        );
      }

      // 3. SLICE PROTECTION: Isolate the tail end for the next pass
      const overlapSize = Buffer.byteLength(searchTarget, 'utf8');

      // Look ahead mitigation: If we found a match that falls partially or fully in the tail,
      // we must subtract it from this lap because it will be processed and counted on the next lap!
      leftoverString = fullTextToScan.slice(-overlapSize);
      if (leftoverString.includes(searchTarget)) {
        matchCount -= leftoverString.split(searchTarget).length - 1;
      }

      // 4. POSITION MANAGEMENT: Advance sequentially by exactly what the OS read
      position += bytesRead;
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
