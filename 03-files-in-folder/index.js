const fs = require('node:fs/promises');
const path = require('node:path');

const dirPath = path.join(__dirname, 'secret-folder');
const readOptions = {
  withFileTypes: true,
};

function getReadableSize(size) {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(3)}MB`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(3)}kB`;
  } else {
    return `${size}B`;
  }
}

(async function () {
  const files = await fs.readdir(dirPath, readOptions);
  for (const file of files) {
    if (file.isFile()) {
      let fileData = file.name.split('.');
      let fileSize = getReadableSize(
        (await fs.stat(path.join(dirPath, file.name))).size,
      );
      fileData.push(fileSize);
      process.stdout.write(`\n${fileData.join(' - ')}`);
    }
  }
})();
