const delay4 = (ms: number, taskName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(` Finished: ${taskName}`);
      resolve(`Data from ${taskName}`);
    }, ms);
  });

async function makeBread() {
  console.log('--- Starting Bread Process (Sequential) ---');
  console.time('Total Bake Time');

  //  Make Dough
  await delay4(2000, 'Make Dough');

  // Let it Rise (Starts ONLY after Step 1 is done)
  await delay4(2000, 'Let it Rise');

  // Bake (Starts ONLY after Step 2 is done)
  await delay4(2000, 'Bake');

  console.timeEnd('Total Bake Time');
  console.log('--- Bread is Ready! ---');
}

makeBread();
