const fs = require("fs");
const path = require("path");

class FileHandler {
  constructor(baseDir = "./files") {
    this.baseDir = baseDir;
  }

  appendToFile(filename, text, callback) {
    const filepath = path.join(this.baseDir, filename);

    fs.appendFile(filepath, text + "\n", (err) => {
      if (err) {
        callback(`Error appending to ${filename}`);
      } else {
        callback(null, `Text appended successfully to ${filename}`);
      }
    });
  }

  readFile(filename, callback) {
    const filepath = path.join(this.baseDir, filename);

    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        callback(`${filename} 404 Not Found`);
      } else {
        callback(null, data);
      }
    });
  }
}

module.exports = FileHandler;
