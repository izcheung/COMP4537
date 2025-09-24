const http = require("http");
const url = require("url");
const DateUtils = require("./modules/utils");
const FileHandler = require("./modules/filehandler");

class Server {
  constructor(port = 8000) {
    this.port = port;
    this.fileHandler = new FileHandler();
  }

  start() {
    http
      .createServer((req, res) => this.handleRequest(req, res))
      .listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
  }

  handleRequest(req, res) {
    const q = url.parse(req.url, true);
    const path = q.pathname;
    const qdata = q.query;

    if (path.startsWith("/COMP4537/labs/3/getDate")) {
      this.handleGetDate(res, qdata.name);
    } else if (path.startsWith("/COMP4537/labs/3/readFile")) {
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      this.handleReadFile(res, filename);
    } else if (path.startsWith("/COMP4537/labs/3/writeFile")) {
      this.handleWriteFile(res, "file.txt", qdata.text);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
    }
  }

  handleGetDate(res, name = "Guest") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(DateUtils.getDate(name));
  }

  handleReadFile(res, filename) {
    this.fileHandler.readFile(filename, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end(`${filename} 404 Not Found!`);
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  handleWriteFile(res, filename, text = "") {
    this.fileHandler.appendToFile(filename, text, (err, message) => {
      res.writeHead(err ? 400 : 200, { "Content-Type": "text/html" });
      res.end(err || message);
    });
  }
}

new Server(10000).start();
