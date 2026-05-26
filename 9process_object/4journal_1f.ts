import * as fs from 'fs';
const list = process.argv[2];
const content = process.argv[3];

function getJournalContent(): string {
  if (fs.existsSync('4journal.txt')) {
    // Return the data out of the function so other code can use it
    return fs.readFileSync('4journal.txt', 'utf-8');
  } else {
    console.log('File does not exist. Please add an entry first!');
    process.exit(1); // Stop the script early so it doesn't crash later
  }
}

if (list === 'add') {
  fs.appendFileSync('4journal.txt', content + '\n');
} // Inside your 'list' command:
else if (list === 'list') {
  const rd = getJournalContent(); // Grabs data or exits automatically
  console.log(rd);
} else if (list === 'clear') {
  if (fs.existsSync('4journal.txt')) {
    fs.writeFileSync('4journal.txt', '');
  } else {
    console.log('File does not exist.');
  }
}
// Inside  'count' command:
else if (list === 'count') {
  const str = getJournalContent();
  const arr = str.split('\n');
  const cleanLines = arr.filter((word) => word.trim() !== '');
  console.log(cleanLines.length);
} else if (list === 'search') {
  const str = getJournalContent();
  const keyword = process.argv[3];
  const arr: string[] = str.split('\n');
  const match: string[] = arr.filter(function (word) {
    if (word.trim() === '') {
      return false;
    } // Check if the line has the keyword
    return word.includes(keyword);
  });
  match.forEach((key) => {
    console.log(key);
  });
}
