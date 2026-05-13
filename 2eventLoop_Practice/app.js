import fs from 'fs';
let start = process.hrtime.bigint();

function logger(message) {
  const current = process.hrtime.bigint();
  const durationInMs = Number(current - start) / 1_000_000;
  console.log(`[${durationInMs.toFixed(3)}ms] - ${message}`);
}
logger('Execution Started');

Promise.resolve().then(() => logger('this is Promise.resolve 1'));
process.nextTick(() => {
  logger('this is process.nextTick 2');
});
setImmediate(() => logger('this is setImmediate 3'));

setTimeout(() => {
  logger('this is setTimeout 4');
}, 0);

fs.readFile('long.txt', () => {
  logger('File is readed. 5');
  setTimeout(() => {
    logger('this is setTimeout inside readFile 5 - 1');
  }, 0);
  setImmediate(() => logger('this is setImmediate inside readFile 5 - 2 '));
  process.nextTick(() => logger('this is inner process.nextTick inside readFile 5 - 3 '));
  Promise.resolve().then(() => logger('this is inner Promise.resolve inside readFile 5 - 4'));
});

logger('Execution Ended');

