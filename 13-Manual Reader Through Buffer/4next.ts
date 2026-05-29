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
  const buffer = 1024 * 1024; //1024 kb = 1mb

  if (freeRAM > 4 * 1024 * buffer) {
    return 1 * buffer; // 1MB chunks if > 4GB RAM free
  } else if (freeRAM > 1 * buffer) {
    return 512 * 1024; // 512KB chunks if > 1GB RAM free
  } else {
    return 64 * 1024; // 64KB chunks if system is low on RAM
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

process.on('SIGINT', () => {
  isAborted = true;
});

// GRACEFUL SHUTDOWN SAFETY NET
process.on('SIGINT', async (): Promise<void> => {
  console.log('\n\n\x1b[33m[SHUTDOWN] Control+C caught mid-operation!\x1b[0m');
  console.log(`Scan stopped at position: ${formatBytes(position)}`);

  await writeSummaryReport('ABORTED BY USER');
  process.exit(0);
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
  console.log(`\x1b[32m Summary document compiled and saved to: ${reportPath}\x1b[0m`);
}

// MAIN  ENGINE

async function main() {
  let fileHandle: fs.FileHandle | null = null;
  try {
    fileHandle = await fs.open(FileAbsolutePath, 'r');

    const sizeFile = await fileHandle.stat();
    totalSize = sizeFile.size;
    console.log(`Total File Size: ${formatBytes(totalSize)} (${totalSize} bytes)`);

    const overlapSize = Buffer.byteLength(searchTarget, 'utf8');

    // Guard Clause against negative math index crashes
    if (overlapSize >= BUFFER_SIZE()) {
      console.error(`\x1b[31mError: Search target is too large for a 16-byte buffer!\x1b[0m`);
      process.exit(1);
    }

    const sharedBuffer = Buffer.alloc(BUFFER_SIZE());
    const decoder = new StringDecoder('utf8');
    let leftover = '';
    let loopPassCounter = 0;

    console.log('--- SCANNING STARTED ---');

    while (!isAborted) {
      // ◄ Changed from 'true' to check the flag on every single lap!
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
    }
    if (isAborted) {
      console.log('\n\n\x1b[33m[SHUTDOWN] Loop safely halted by interrupt flag.\x1b[0m');
      await writeSummaryReport('ABORTED BY USER');
      process.exit(0);
    } else {
      console.log('\nScan completed naturally.');
      await writeSummaryReport('COMPLETED SUCCESSFULLY');
    }

    console.log(`\nScan finished naturally! Total Passes executed: ${loopPassCounter}`);
    console.log(`Total occurrences found: ${matchCount}`);

    // Regular Compilation upon successful natural finish
    await writeSummaryReport('COMPLETED SUCCESSFULLY');
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
