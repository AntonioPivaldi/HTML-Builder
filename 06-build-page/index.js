const fs = require('node:fs');
const path = require('node:path');

const destFolder = path.join(__dirname, 'project-dist');
const destTemplate = path.join(destFolder, 'index.html');
const destAssets = path.join(destFolder, 'assets');
const srcAssetsFolder = path.join(__dirname, 'assets');
const srcTemplate = path.join(__dirname, 'template.html');
const srcComponents = path.join(__dirname, 'components');

async function copyDirectory(srcFolder, destFolder) {
  await fs.promises.rm(destFolder, { force: true, recursive: true });
  await fs.promises.mkdir(destFolder);
  const srcFiles = await fs.promises.readdir(srcFolder, {
    withFileTypes: true,
  });
  for (const file of srcFiles) {
    const srcFile = path.join(srcFolder, file.name);
    const destFile = path.join(destFolder, file.name);
    if (file.isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      await fs.promises.copyFile(srcFile, destFile);
    }
  }
}

async function mergeStyles() {
  const src = path.join(__dirname, 'styles');
  const writeStream = fs.createWriteStream(path.join(destFolder, 'style.css'));
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
}

async function insertComponents() {
  let template = await fs.promises.readFile(srcTemplate, 'utf-8');
  const components = await fs.promises.readdir(srcComponents, {
    withFileTypes: true,
  });
  for (const component of components) {
    const srcComponent = path.join(srcComponents, component.name);
    const componentName = component.name.split('.').slice(0, -1).join('.');
    const componentContent = await fs.promises.readFile(srcComponent, 'utf-8');
    template = template.replace(`{{${componentName}}}`, componentContent);
    fs.promises.writeFile(destTemplate, template);
  }
}

async function clearBuildFolder() {
  await fs.promises.rm(destFolder, { force: true, recursive: true });
  await fs.promises.mkdir(destFolder);
}

(async function () {
  await clearBuildFolder();
  await copyDirectory(srcAssetsFolder, destAssets);
  await mergeStyles();
  await insertComponents();
})();
