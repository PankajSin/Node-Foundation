const delay = <T>(ms: number, result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

async function fetchStock(stock: number) {
  console.log('Fetching stock...');
  const value = await delay(1000, stock * 2); // TS now knows 'id' is a string
  console.log(` Got stock_value: ${value}`);
  return value;
}

async function uploadReport(report: number) {
  await delay(2000, report);
  console.log(`Total Stock of ${report} uploaded successfully .`);
}

async function main() {
  // Start all three at once!
  const [a, b, c] = await Promise.all([fetchStock(10), fetchStock(20), fetchStock(30)]);

  let total = a + b + c;

  await uploadReport(total);
}
main();

// Promise.all returns Promise<[number, number, number]>
// const results = await Promise.all([fetchStock(10), fetchStock(20), fetchStock(30)]);

// // Results is: [20, 40, 60]
// // a = 20 (number)
// // b = 40 (number)
// // c = 60 (number)
// const [a, b, c] = results;
