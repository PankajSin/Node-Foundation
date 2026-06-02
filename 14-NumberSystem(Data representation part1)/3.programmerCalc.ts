import readline from 'readline';

// Set up terminal interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('=== NODE.JS PROGRAMMER CALCULATOR ===');
console.log('Allowed formats: 25 (Dec), 0b1101 (Bin), 0o755 (Oct), 0x3F (Hex)\n');

rl.question('Enter a number: ', (input) => {
  let decimalValue;
  const cleanInput = input.trim();

  // 1. Parse the input automatically based on its prefix
  if (cleanInput.startsWith('0b') || cleanInput.startsWith('0B')) {
    decimalValue = parseInt(cleanInput.slice(2), 2);
  } else if (cleanInput.startsWith('0o') || cleanInput.startsWith('0O')) {
    decimalValue = parseInt(cleanInput.slice(2), 8);
  } else if (cleanInput.startsWith('0x') || cleanInput.startsWith('0X')) {
    decimalValue = parseInt(cleanInput.slice(2), 16);
  } else {
    decimalValue = parseInt(cleanInput, 10);
  }

  //  Validate if the input was a legal number
  if (isNaN(decimalValue)) {
    console.log(' Invalid number format! Please try again.');
    rl.close();
    return;
  }

  console.log('\n--- CONVERSION RESULTS ---');
  console.log(`🔹 Decimal (Base 10) : ${decimalValue}`);
  console.log(`🔹 Binary  (Base 2)  : 0b${decimalValue.toString(2)}`);
  console.log(`🔹 Octal   (Base 8)  : 0o${decimalValue.toString(8)}`);
  console.log(`🔹 Hex     (Base 16) : 0x${decimalValue.toString(16).toUpperCase()}`);

  rl.close();
});
