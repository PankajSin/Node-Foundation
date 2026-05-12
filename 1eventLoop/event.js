import * as readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let iterations = 0;
const MAX_ITERATIONS = 1000;

console.log('1. Script Started. (Try typing "STATS" while it runs!)');

function doHeavyWorkInChunks() {
  if (iterations < MAX_ITERATIONS) {
    // 1. Do a tiny bit of "Heavy" math
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }

    iterations++;
    if (iterations % 100 === 0) console.log(`>> Progress: ${iterations / 10}%`);

    // 2. THE SECRET SAUCE: Put the next chunk at the back of the line
    setImmediate(doHeavyWorkInChunks);
  } else {
    console.log('>> Finished all work!');
  }
}

// Start the "Friendly" loop
doHeavyWorkInChunks();

rl.on('line', (input) => {
  if (input.trim().toUpperCase() === 'STATS') {
    console.log(">> [ALIVE] The Keyboard is responsive because the loop isn't blocked!");
  }
});
