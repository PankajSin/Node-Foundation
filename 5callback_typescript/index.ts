type greetCallback = (message: string) => void;

function greet(name: string, callback: greetCallback): void {
  console.log('Waiting 2 seconds...');

  // Use setTimeout here
  setTimeout(() => {
    const greeting = `Hello, ${name}!`;
    // ??? Call the callback here with the greeting
    callback(greeting);
  }, 2000);
}
greet('Pankaj', (message: string) => {
  console.log(message);
});
