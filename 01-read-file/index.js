const fs = require('node:fs');
const path = require('node:path');

const readFilePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(readFilePath);

let output = '';

stream.on('data', (chunk) => (output += chunk));
stream.on('end', () => process.stdout.write(output));
