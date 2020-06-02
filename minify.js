const Terser = require('terser');
const fs = require('fs');
const path = require('path');
const copy = require('recursive-copy');
const cliProgress = require('cli-progress');
const _colors = require('colors');

const sourcePath = './bin';
const targetPath = './dist';

function generateDistFolder(source, target) {
  return copy(source, target);
}

function getAllFiles(target, arrayOfFiles) {
  let files = fs.readdirSync(target);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(target + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(target + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, target, '/', file));
    }
  });

  return arrayOfFiles.filter((path) => path.match(/\.js$/));
}

function minifyFiles(filePaths) {
  var b1 = new cliProgress.Bar({
    format:
      'Minify Progress |' +
      _colors.cyan('{bar}') +
      '| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  b1.start(filePaths.length, 0);
  var value = 0;

  filePaths.forEach((filePath) => {
    fs.writeFileSync(
      filePath,
      Terser.minify(fs.readFileSync(filePath, 'utf8')).code
    );
    b1.update((value += 1));
    if (value >= b1.getTotal()) {
      // stop timer
      b1.stop();
    }
  });
}

generateDistFolder(sourcePath, targetPath)
  .then(() => {
    console.log('===============  Folder Copy Success  ===============');
    const filePath = getAllFiles(targetPath);
    console.log('=============== Listing File Path Done ===============');
    minifyFiles(filePath);
    console.log('===============      Minify Done      ===============');
  })
  .catch(() => {
    console.log('Dist Folder Generation Fails');
  });
