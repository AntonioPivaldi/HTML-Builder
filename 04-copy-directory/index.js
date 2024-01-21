const fs = require('node:fs/promises');
const path = require('node:path');

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

(async function () {
  await fs.rm(destFolder, { force: true, recursive: true });
  await fs.mkdir(destFolder);
  const src = await fs.readdir(srcFolder);
  for (const file of src) {
    const srcFile = path.join(srcFolder, file);
    const destFile = path.join(destFolder, file);
    await fs.copyFile(srcFile, destFile);
  }
})();
