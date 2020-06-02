const fs = require('fs');
const fsPromises = fs.promises;
const copy = require('recursive-copy');

const deleteFolder = (target) => {
  fsPromises
    .access(target, fs.constants.F_OK)
    .then((resolve) => {
      return fsPromises
        .unlink(target)
        .then((resolve) => {
          return true;
        })
        .catch((reject) => {
          return false;
        });
    })
    .catch((reject) => {
      if (reject && reject.code === 'ENOENT') {
        return true;
      } else {
        return false;
      }
    });

  //   try {
  //     const result = await fsPromises.access(target, fs.constants.F_OK);
  //     console.log('step one');
  //     console.log(result);
  //     if (result) {
  //       const result = await fsPromises.unlink(target);
  //       console.log('step 2');
  //       console.log(result);
  //       return true;
  //     }
  //   } catch (err) {
  //     if (err && err.code === 'ENOENT') {
  //       return true;
  //     }
  //   }
};

async function generateDistFolder(target) {
  console.log('step 3');
  const result = await copy('./bin', target);
  console.log(result);
  return result;
}

const result = deleteFolder('./dist2');
console.log(result);
// if (result) {
//   generateDistFolder('./dist2');
// }
