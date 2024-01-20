const fs = require('node:fs');
const path = require('node:path');

const outputFilePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(outputFilePath);

function handleStart() {
  process.stdout.write(' - Hello. Please, enter text you want to save: \n\n');
}

function handleInput(data) {
  if (data === 'exit') {
    doExit();
  } else {
    stream.write(`${data} \n`);
  }
}

function doExit() {
  process.stdout.write(
    '\n - Your saved text is in "text.txt". Have a very safe day!',
  );
  process.exit();
}

handleStart();
process.stdin.on('data', (data) => handleInput(data.toString().trim()));
process.on('SIGINT', doExit);
