let x = 1;
const brek = <T>(ms: number, result: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(result), ms));

async function processPayment(pay:number){

    if(pay <= 0 ){
        throw new Error('Sorry for some glitches');
    }
    const done = await brek(1000,`Payment is done`)
    return done;
}

async function updateAnalytics(){
    const update = await brek(1000,`update is done`);
    return update;
}

async function main(){
    try{
         const message = await processPayment(100);
         console.log(message);
         try{
             const update = await updateAnalytics();
             console.log(update);
         }
         catch(err){

         }
    }
    catch(err){
        console.log(err);
    } finally {
        // This runs NO MATTER WHAT
        console.log("Transaction session ended. Cleaning up resources...");
    }
}

main();