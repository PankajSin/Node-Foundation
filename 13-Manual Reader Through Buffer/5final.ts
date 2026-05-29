import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';
import { StringDecoder } from 'string_decoder';

console.log('DEBUG - Raw Environment TXT:', process.env.TXT);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

let BUFFER_SIZE = (): number => {
  const freeRAM = os.freemem();
  console.log(`Free RAM on this system is ${(freeRAM / 1024 / 1024).toFixed(2)} MB`);
  const buffer = 1024 * 1024;

  if (freeRAM > 4 * 1024 * buffer) {
    return 1 * buffer;
  } else if (freeRAM > 1 * buffer) {
    return 512 * 1024;
  } else {
    return 64 * 1024;
  }
};

const FileRelativePath = process.argv[2] || 'server.txt';
const FileAbsolutePath = path.resolve(FileRelativePath);
const searchTarget = process.env.TXT || '[ERROR]';
console.log('Processed Search Target:', searchTarget);

// GLOBALS FOR LIFECYCLE ACCESS
let matchCount = 0;
let position = 0;
let totalSize = 0;
let isAborted = false;

// SINGLE CLEAN INTERRUPT LISTENER: Only toggles the flag variable!
process.on('SIGINT', () => {
  isAborted = true;
});

// Report generator function
async function writeSummaryReport(status: string): Promise<void> {
  const reportPath = path.resolve('scan_summary.txt');
  const reportContent = util.format(
    '==================================================\n' +
      '       LOG ANALYSIS SYSTEM SUMMARY REPORT\n' +
      '==================================================\n' +
      'Scan Status:    %s\n' +
      'Target File:    %s\n' +
      'Physical Size:  %s (%d bytes)\n' +
      'Search Target:  "%s"\n' +
      'Matches Found:  %d\n' +
      '--------------------------------------------------\n' +
      'ENVIRONMENT METRICS\n' +
      '--------------------------------------------------\n' +
      'Machine Host:   %s\n' +
      'Executing User: %s\n' +
      'Current Heap:   %s MB\n' +
      '==================================================\n',
    status,
    FileRelativePath,
    formatBytes(totalSize),
    totalSize,
    searchTarget,
    matchCount,
    os.hostname(),
    os.userInfo().username,
    (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
  );

  await fs.writeFile(reportPath, reportContent, 'utf8');
  console.log(`\x1b[32m✔ Summary document compiled and saved to: ${reportPath}\x1b[0m`);
}

// Promisified utility helper to yield the event loop thread
const yieldThread = util.promisify(setImmediate);

async function main() {
  let fileHandle: fs.FileHandle | null = null;
  try {
    fileHandle = await fs.open(FileAbsolutePath, 'r');

    const sizeFile = await fileHandle.stat();
    totalSize = sizeFile.size;
    console.log(`Total File Size: ${formatBytes(totalSize)} (${totalSize} bytes)`);

    const overlapSize = Buffer.byteLength(searchTarget, 'utf8');

    if (overlapSize >= BUFFER_SIZE()) {
      console.error(
        `\x1b[31mError: Search target is too large for the buffer configuration!\x1b[0m`,
      );
      process.exit(1);
    }

    const sharedBuffer = Buffer.alloc(BUFFER_SIZE());
    const decoder = new StringDecoder('utf8');
    let leftover = '';
    let loopPassCounter = 0;

    console.log('--- SCANNING STARTED (Press Ctrl+C to test graceful halt) ---');

    while (!isAborted) {
      const { bytesRead } = await fileHandle.read(sharedBuffer, 0, sharedBuffer.length, position);

      if (bytesRead === 0) break;

      loopPassCounter++;
      const dataString = decoder.write(sharedBuffer.subarray(0, bytesRead));
      const fullString = leftover + dataString;

      if (fullString.includes(searchTarget)) {
        matchCount += fullString.split(searchTarget).length - 1;
      }

      leftover = fullString.slice(-overlapSize);
      if (leftover.includes(searchTarget)) {
        matchCount -= leftover.split(searchTarget).length - 1;
      }

      position = position + bytesRead;

      // THREAD BALANCER: Every 500 loops, briefly yield control back to Node.js
      // so the event loop can register  keyboard Ctrl+C hit!
      if (loopPassCounter % 500 === 0) {
        await yieldThread();
      }
    }

    // THE CLEAN EVALUATION SWITCH
    if (isAborted) {
      console.log('\n\n\x1b[33m[SHUTDOWN] Loop safely halted by interrupt flag.\x1b[0m');
      console.log(`Stopped near file position: ${formatBytes(position)}`);
      await writeSummaryReport('ABORTED BY USER');
      process.exit(0);
    } else {
      console.log('\nScan completed naturally.');
      console.log(`Total Passes executed: ${loopPassCounter}`);
      console.log(`Total occurrences found: ${matchCount}`);
      await writeSummaryReport('COMPLETED SUCCESSFULLY');
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (fileHandle) {
      await fileHandle.close();
      console.log('File stream safely released.');
    }
  }
}

main();
