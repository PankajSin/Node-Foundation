// import * as fs from 'fs'; //this for fs.existsSync
// import * as fsPromises from 'fs/promises'; //Use  for await fs.readFile
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
const list = process.argv[2];
const content = process.argv[3];

async function getJournalContent(): Promise<string> {
  if (existsSync('4journal.txt')) {
    // Return the data out of the function so other code can use it
    const result = await fs.readFile('4journal.txt', 'utf-8');
    return result;
  } else {
    console.log('File does not exist. Please add an entry first!');
    process.exit(1); // Stop the script early so it doesn't crash later
  }
}

async function main() {
  if (list === 'add') {
    await fs.appendFile('4journal.txt', content + '\n');
    console.log('Entry added successfully!');
  } // Inside  'list' command:
  else if (list === 'list') {
    const rd = await getJournalContent(); // Grabs data or exits automatically
    console.log(rd);
  } else if (list === 'clear') {
    if (existsSync('4journal.txt')) {
      await fs.writeFile('4journal.txt', '');
      console.log('Journal cleared!');
    } else {
      console.log('File does not exist.');
    }
  }
  // Inside  'count' command:
  else if (list === 'count') {
    const str = await getJournalContent();
    const arr = str.split('\n');
    const cleanLines = arr.filter((word) => word.trim() !== '');
    console.log(`Total entries: ${cleanLines.length}`);
  }
  //search command
  else if (list === 'search') {
    const str = await getJournalContent();
    const keyword = process.argv[3];
    const arr: string[] = str.split('\n');

    const match: string[] = arr.filter(function (word) {
      if (word.trim() === '') {
        return false;
      } // Check if the line has the keyword
      return word.includes(keyword);
    });
    if (match.length > 0) {
      match.forEach((key) => console.log(key));
    } else {
      console.log(`No entries found matching: "${keyword}"`);
    }
  } else {
    console.log('Invalid command. Use: add, list, clear, count, or search.');
  }
}
main();
