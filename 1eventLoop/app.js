import * as readline from 'node:readline';

const rlKeyboard = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('1. Script Started. (Try typing "STATS" now...)');

// A "Heavy" Synchronous Function that blocks the loop
function blockTheLoop(seconds) {
  console.log(`>> BLOCKING the Event Loop for ${seconds} seconds...`);
  const start = Date.now();
  // This while-loop stays on the "Main Thread" and NEVER leaves.
  while (Date.now() - start < seconds * 1000) {
    // The Chef is staring at the steak and ignoring everything else.
  }
  console.log('>> Loop is UNBLOCKED!');
}

// Trigger the block after 2 seconds
setTimeout(() => {
  blockTheLoop(5);
}, 2000);

rlKeyboard.on('line', (input) => {
  if (input.trim().toUpperCase() === 'STATS') {
    console.log('>> Keyboard is alive! You typed STATS.');
  }
});
