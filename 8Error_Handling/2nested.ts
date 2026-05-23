const brek = <T>(ms: number, result: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(result), ms));
  
async function videoPlayer(on:boolean){
 const play = brek(1000,`Video is playing now.`);
 if(on === false){
    throw new Error("Sorry video is corrupt!");
}
 return play;
}
async function recommendVideo(on:boolean){
    if(on === true){
        throw new Error("Sorry recommended videos are not loaded yet !");
    }
    // Await them all so you return the actual text strings
    return await Promise.all([
        brek(1000, `first video`),
        brek(1000, `second video`),
        brek(1000, `third video`)
    ]);
}
async function main(){
     try{
        const start =await videoPlayer(true);
        console.log(start)
        try{
             const rec = await recommendVideo(true);
             console.log(rec);

        }catch(err){
            console.log(err);
        }
     }
     catch(err){
        console.log(err);
     }
}
main();