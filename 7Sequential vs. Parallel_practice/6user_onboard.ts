const process = <T>(ms: number, result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));
const getRandomString = () => Math.random().toString(36).substring(7);

async function uploadPhoto(userId: string): Promise<string> {
  const photo = await process(1500, `uploaded_photo_${userId}`);
  return photo;
}
async function sendEmail() {
  const email = await process(1500, `email_sent`);
  return email;
}
async function setupAnalytics() {
  const folder = await process(1500, `Folder Created!`);
  return folder;
}
async function createUser() {
  const userId = await process(2000, getRandomString());
  return userId;
}

async function start() {
  console.time('Total Parallel Time'); // Start Timer
  const newId = await createUser();
  const [photo, email, folder] = await Promise.all([
    uploadPhoto(newId),
    sendEmail(),
    setupAnalytics(),
  ]);
  //   When  write const [a, b] = Promise.all(...), TypeScript/JavaScript thinks:
  // Right side: "This is a Promise object."
  // Left side: "The user is trying to extract items from an Array."
  console.log(photo);
  console.log(email);
  console.log(folder);
  console.log(`Ongoing Process Complete for user with ${newId}`);

  console.timeEnd('Total Parallel Time'); // End Timer
}

start();
