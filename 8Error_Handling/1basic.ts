process.on('unhandledRejection', (reason: any, promise) => {
  console.log('--- CRITICAL: Unhandled Promise Rejection ---');
  console.log('Reason:', reason.message);
});
async function deposit(amount: number) {
  return amount;
}
async function withdraw(amount: number) {
  if (amount === 50) {
    throw new Error('Amount is not withdaw!');
  }
  return amount;
}

async function main() {
  try {
    const [depRes, witRes] = await Promise.all([deposit(50), withdraw(50)]);
    console.log('Success:', depRes, witRes);
  } catch (err: any) {
    console.log(err);
  }
}
// main()
withdraw(50);
