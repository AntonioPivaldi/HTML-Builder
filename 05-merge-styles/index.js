const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

(async function () {
  const srcFiles = await fs.promises.readdir(src);
  for (const file of srcFiles) {
    if (file.split('.').pop() === 'css') {
      const srcFile = path.join(src, file);
      const readStream = fs.createReadStream(srcFile);

      let styles = '';
      readStream.on('data', (chunk) => (styles += chunk));
      readStream.on('end', () => {
        writeStream.write(styles);
      });
    }
  }
})();
