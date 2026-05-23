const brek = <T>(ms: number, result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

async function searchStore(storeName: string, price: number) {
  const store = await brek(2000, { name: storeName, price: price });
  if (storeName === 'Store B') {
    throw new Error('Store B is down');
  }
  return store;
}

async function purchaseBook(storeName: string, price: number) {
  const msg = await brek(1000, `${storeName} is best with cheap price ${price}`);
  return msg;
}

async function search() {
  console.time('Total Time');

  // 1. Parallel Search

  // 1. Parallel call with fallbacks
  const [resultA, resultB] = await Promise.all([
    searchStore('Store A', 50).catch(() => null),
    searchStore('Store B', 40).catch(() => null),
  ]);

  // 2. The Logic to find the best available store
  // Define what a "Store" looks like first
  type Store = { name: string; price: number };

  // Tell TypeScript 'winner' can be a Store OR null
  let winner: Store | null = null;

  if (resultA && resultB) {
    // BOTH are valid, pick the cheapest
    winner = resultA.price < resultB.price ? resultA : resultB;
  } else if (resultA) {
    // ONLY A is valid
    winner = resultA;
  } else if (resultB) {
    // ONLY B is valid
    winner = resultB;
  }

  // 3. The Final Action
  if (winner) {
    const msg = await purchaseBook(winner.name, winner.price);
    console.log(msg);
  } else {
    console.log('All stores are down. Cannot purchase.');
  }

  console.timeEnd('Total Time');
}

search();
