process.stdout.write('How many seconds?');

let limit1: number = 0;
let timer;

function Repeat() {
  process.stdout.write('\r ' + limit1 + '    ');
  if (limit1 > 0) {
    timer = setTimeout(Repeat, 1000);
  } else {
    console.log('\nFinished!');
    process.exit(0);
  }
  limit1--;
}

process.stdin.on('data', (data) => {
  const convert = data.toString().trim();
  const num: number = Number(convert);
  limit1 = num;
  if (isNaN(limit1)) {
    console.log('Error: Please provide a number!');
    process.exit(1);
  }
  Repeat();
  process.stdin.pause();
});
