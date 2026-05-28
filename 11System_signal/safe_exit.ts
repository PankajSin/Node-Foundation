let isWriting = false;
setInterval(() => {
  console.log(' Starting data write...');
  isWriting = true;

  setTimeout(() => {
    console.log(' Data write finished safely.');
    isWriting = false;
    console.log('1second is complete.----------------');
  }, 1000); // Takes 1 seconds to write
  console.log('4second cycle is complete.+++++++++++++++');
}, 4000); // Happens every 4 seconds

process.on('SIGINT', () => {
  if (isWriting === false) {
    console.log('Safe to close. Goodbye!');
    process.exit(0);
  } else {
    console.log('Warning: Write in progress! Delaying shutdown until safe...');
    const interval = setInterval(() => {
      if (isWriting === false) {
        console.log('Data Saved');
        clearInterval(interval);
        process.exit(0);
      }
    }, 100);
  }
});
