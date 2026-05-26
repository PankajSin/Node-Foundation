// 1. Define  secret key
const SECRET_KEY = 'super-secret-123';

// 2. Check the environment variables
const userKey = process.env.ACCESS_KEY;

if (userKey !== SECRET_KEY) {
  console.error(' ERROR: Access Denied! Please provide a valid ACCESS_KEY.');
  console.log("Hint: Try running with 'ACCESS_KEY=super-secret-123'");
  process.exit(1); // Stop everything
}
console.log('Access Granted. Initializing Calculator...');

const args: string[] = process.argv.slice(2);

const operation: string = args[0];
const num1: number = Number(args[1]);
const num2: number = Number(args[2]);

//validation
if (operation === null || isNaN(num1) || isNaN(num2)) {
  process.exit(1);
}
//calculation
let result = 0;
if (operation === 'add') {
  result = num1 + num2;
} else if (operation === 'substract') {
  result = num1 - num2;
} else if (operation === 'multiply') {
  result = num1 * num2;
} else if (operation === 'divide') {
  result = num1 / num2;
} else {
  console.log(`Unknown operation: ${operation}`);
  process.exit(1);
}
console.log(`--- Calculator Result ---`);
console.log(`${num1} ${operation} ${num2} = ${result}`);

// run with $env:ACCESS_KEY="super-secret-123";node calc.ts divide 4 2.5
