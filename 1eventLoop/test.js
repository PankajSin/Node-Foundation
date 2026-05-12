import fs from 'fs';

fs.readFile('package.json', () => {
  console.log('Read');
});
setTimeout(() => {
  console.log('Set_Timeout 2');
}, 500);
