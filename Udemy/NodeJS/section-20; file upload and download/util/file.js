const fs = require("fs");

const deleteFile = (filePath) => {
  // deleting the file at path
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
