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
      const fileNameArr = file.name.split('.');
      const fileExt = fileNameArr.pop();
      const fileName = fileNameArr.join('.');
      const filePath = path.join(dirPath, file.name);
      const fileSize = getReadableSize((await fs.stat(filePath)).size);
      process.stdout.write(`\n${fileName} - ${fileExt} - ${fileSize}`);
    }
  }
})();
