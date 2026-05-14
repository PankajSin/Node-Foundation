import * as readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log('1. Script is running... (Type something and press Enter)');

rl.on('line', (line) => {
  const now = new Date().toLocaleTimeString('en-GB');
  console.log(`3.Line:${line} with time ${now}`);

  // Optional: Type 'exit' to stop the script
  if (line.toLowerCase() === 'exit') rl.close();
});

rl.on('close', () => {
  console.log('4. End');
  process.exit(0);
});
