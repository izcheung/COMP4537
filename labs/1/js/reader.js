import { Navigation } from "./common.js";
import { MESSAGES } from "../lang/messages/en/user.js";

class ReaderTextAreaManager {
  constructor() {
    this.container = document.querySelector("section");
  }

  addElement(text) {
    const wrapper = document.createElement("div");
    const newTextInput = document.createElement("textarea");
    newTextInput.value = text;
    wrapper.appendChild(newTextInput);
    this.container.appendChild(wrapper);
  }

  clearSection() {
    this.container.innerHTML = "";
  }

  addTimeStamp(time) {
    const timeStamp = document.querySelector("#timestamp");
    timeStamp.textContent = `${MESSAGES.readTimeStamp} ${time}`;
  }
}

class ReadLocalStorage {
  constructor(textAreaManager) {
    this.intervalId = null;
    this.readerTextAreaManager = textAreaManager;
    this.existingNotes = new Set();
  }

  start(interval = 2000) {
    this.intervalId = setInterval(() => this.readAll(), interval);
  }

  readAll() {
    this.readerTextAreaManager.clearSection();
    const notesJSON = localStorage.getItem("notes");
    const notes = JSON.parse(notesJSON || "[]");

    notes.forEach((note) => {
      this.readerTextAreaManager.addElement(note.content);
    });

    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour12: true,
    });
    this.readerTextAreaManager.addTimeStamp(timeNow);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

class ReaderApp {
  constructor() {
    const readerTextAreaManager = new ReaderTextAreaManager();
    this.readLocalStorage = new ReadLocalStorage(readerTextAreaManager);
    this.backButton = new Navigation();
  }

  run() {
    this.readLocalStorage.start();
  }
}

new ReaderApp().run();
