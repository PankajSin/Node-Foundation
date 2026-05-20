const delay2 = (ms: number, taskName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(` Finished: ${taskName}`);
      resolve(`Data from ${taskName}`);
    }, ms);
  });

async function computer(task: string) {
  await delay2(2000, task);
}
async function launchGame(launch: string) {
  await delay2(1000, launch);
}
async function main() {
  console.time('Total Parallel Time'); // Start Timer

  await Promise.all([computer('assets'), computer('system')]);
  await launchGame('launch');

  console.timeEnd('Total Parallel Time'); // End Timer
}
main();
