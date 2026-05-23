async function withdraw(amount: number) {
  if (amount === 50) {
    throw new Error('Withdrawal Failed: Amount cannot be 50!');
  }
  return amount;
}

async function main() {
  // 1. Get raw arguments
  const args = process.argv.slice(2);

  // 2. Check for specific practice flag
  if (args.includes('--run-withdraw')) {
    console.log('Flag detected. Attempting withdrawal...');
    try {
      await withdraw(50);
    } catch (err: any) {
      console.error('Caught error:', err.message);
    }
  } else {
    console.log('No --run-withdraw flag found. Skipping bank task.');
    console.log('Usage: node script.js --run-withdraw');
  }
}

main();
