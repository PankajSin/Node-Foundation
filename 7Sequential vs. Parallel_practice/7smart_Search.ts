const brek = <T>(ms: number, result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

async function searchStore(storeName: string, price: number) {
  const store = await brek(2000, { name: storeName, price: price });
  return store;
}

async function purchaseBook(storeName: string, price: number) {
  const msg = await brek(1000, `${storeName} is best with cheap price ${price}`);
  return msg;
}

async function search() {
  console.time('Total Parallel Time'); // Start Timer
  const [resultA, resultB] = await Promise.all([
    searchStore('Store A', 50),
    searchStore('Store B', 40),
  ]);
  const winner = resultB.price < resultA.price ? resultB : resultA;

  //     // 3. Sequential Purchase
  const finalMsg = await purchaseBook(winner.name, winner.price);
  console.log(finalMsg);

  console.timeEnd('Total Parallel Time'); // End Timer
}
search();
