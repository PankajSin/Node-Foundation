const countdown: string[] = process.argv.slice(2);

const count: string = countdown[0];
let limit: number = Number(count);

let timerId;
if (isNaN(limit)) {
  console.log('Error: Please provide a number!');
  process.exit(1);
}

function limitedRepeat() {
  //   console.log('Run count:', limit);
  process.stdout.write('\r ' + limit + '     ');

  if (limit > 0) {
    timerId = setTimeout(limitedRepeat, 1000);
  } else {
    console.log('\nFinished!');
    process.exit(0);
  }
  limit--;
}

limitedRepeat();
