type divideCallback = (err: Error | null, result?: number) => void;

function divide(a: number, b: number, callback: divideCallback): void {
  if (b == 0) {
    callback(new Error('Infinite error'));
  } else {
    callback(null, a / b);
  }
}
divide(10, 0, (err, result) => {
  if (err) {
    console.error('Oops:', err.message);
    return;
  }
  console.log('Success! Result is:', result);
});
