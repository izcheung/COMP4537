const fs = require("fs");
const path = require("path");
const { notFound, success, error } = require("../lang/en/en");
class FileHandler {
  constructor(baseDir = "./files") {
    this.baseDir = baseDir;
  }

  appendToFile(filename, text, callback) {
    const filepath = path.join(this.baseDir, filename);

    fs.appendFile(filepath, text + "\n", (err) => {
      if (err) {
        const errorMessage = error.replace("%1", filename);
        callback(errorMessage);
      } else {
        const successMessage = success.replace("%1", filename);
        callback(null, successMessage);
      }
    });
  }

  readFile(filename, callback) {
    const filepath = path.join(this.baseDir, filename);

    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        const notFoundMessage = notFound.replace("%1", filename);
        callback(notFoundMessage);
      } else {
        callback(null, data);
      }
    });
  }
}

module.exports = FileHandler;
