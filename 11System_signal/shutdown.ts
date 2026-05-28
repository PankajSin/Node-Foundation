// Graceful shutdown
console.log('My Process ID is:', process.pid);
const intervalId = setInterval(() => {
  console.log('This will run forever until stopped.');
}, 1000);

process.on('SIGINT', () => {
  console.log('gracefully shutdown initaited...');
  //   process.exit(0);  when i cooment this line ctrl+c is freeze by me I have to provide process.id to kill (first line)
  //this process in second terminal
});
