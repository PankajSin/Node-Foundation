import fs from 'fs';

function logger(message) {
  const now = performance.now();
  console.log(`[${now.toFixed(3)}ms] - ${message}`);
}

logger('Execution Started');

//  Microtasks
Promise.resolve().then(() => logger('this is Promise.resolve 1'));
process.nextTick(() => logger('this is process.nextTick 2'));

// Macrotasks
setImmediate(() => logger('this is setImmediate 3'));
setTimeout(() => logger('this is setTimeout 4'), 0);

// I/O
fs.readFile('package.json', () => {
  logger('File is readed. 5');

  setTimeout(() => logger('this is setTimeout inside readFile 5-1'), 0);
  setImmediate(() => logger('this is setImmediate inside readFile 5-2'));
  process.nextTick(() => logger('this is inner process.nextTick inside readFile 5-3'));
  Promise.resolve().then(() => logger('this is inner Promise.resolve inside readFile 5-4'));
});

logger('Execution Ended');
