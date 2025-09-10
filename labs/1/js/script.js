import { MESSAGES } from "../lang/messages/en/user.js";

class PopulateHomePage {
  populateText() {
    const title = document.querySelector("h1");
    title.textContent = MESSAGES.title;

    const author = document.querySelector("h2");
    author.textContent = MESSAGES.author;

    const readerLink = document.querySelector("#readerLink");
    readerLink.textContent = MESSAGES.readerLink;

    const writerLink = document.querySelector("#writerLink");
    writerLink.textContent = MESSAGES.writerLink;
  }
}

new PopulateHomePage().populateText();
