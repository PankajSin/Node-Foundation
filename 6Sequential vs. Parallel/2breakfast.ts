const delay1 = (ms: number, taskName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Finished: ${taskName}`);
      resolve(`Data from ${taskName}`);
    }, ms);
  });

// 1. Remove the timer from inside the individual task
async function cooking(item: string) {
  await delay1(2000, item);
}

// 2. Create a "Main" function to wrap the whole process
async function runBreakfast() {
  console.time('Total Parallel Time'); // Start Timer

  await Promise.all([cooking('bread'), cooking('egg'), cooking('coffee')]);

  console.timeEnd('Total Parallel Time'); // End Timer
}

runBreakfast();
