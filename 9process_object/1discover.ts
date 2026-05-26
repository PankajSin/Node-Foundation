// Type Recognition: By default, TypeScript assumes  , writing code for a browser
console.log('Current Working Directory:', process.cwd());
console.log('Current Node Version: ', process.version);
console.log('Current Operating System:', process.platform);

const memory = process.memoryUsage();
// console.log(memory);
console.log(`Memory Usage: ${Math.round(memory.rss / 1024 / 1024)} MB`);
console.log('Time Running:', process.uptime(), 'seconds');

const userArgs = process.argv;
console.log(userArgs.slice(2));
console.log(userArgs[0]);
console.log(userArgs[1]);
console.log(userArgs.join('\n'));

const firstArg = userArgs[0] || 'No argument provided';
console.log(firstArg);
console.log(`Total arguments: ${userArgs.length}`);

//validation
if (userArgs.length < 2) {
  console.log('Error: Please provide at least two arguments.');
  process.exit(1); // Stops the script with an error code
}

const sentence = userArgs.join(' ');

console.log(sentence);
