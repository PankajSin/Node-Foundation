import fs from 'node:fs';

const files = Array.from({ length: 10 }, (_, i) => `test_file_${i + 1}.txt`);

// 1. SEQUENTIAL TEST (The "Slow" Way)
async function runSequential() {
  console.log('--- Starting Sequential Read ---');
  const start = performance.now();

  for (const file of files) {
    // We 'await' each one, so the loop PAUSES until the file is done
    await fs.promises.readFile(file);
    console.log(`Finished ${file} sequentially...`);
  }

  const end = performance.now();
  console.log(`Total Sequential Time: ${(end - start).toFixed(2)}ms\n`);
}

// 2. CONCURRENT TEST (The "Fast" Non-Blocking Way)
async function runConcurrent() {
  console.log('--- Starting Concurrent Read ---');
  const start = performance.now();
  let finishedCount = 0;

  //
  files.forEach((file) => {
    fs.readFile(file, (err, data) => {
      finishedCount++;
      console.log(`Finished ${file} concurrently! (Total done: ${finishedCount})`);

      //
      if (finishedCount === files.length) {
        const end = performance.now();
        console.log(`Total Concurrent Time: ${(end - start).toFixed(2)}ms`);
      }
    });
  });
}

// Execute the tests
async function startLab() {
  await runSequential();
  await runConcurrent();
}

startLab();
