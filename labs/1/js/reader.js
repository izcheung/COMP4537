import { Navigation, Note } from "./common.js";
import { MESSAGES } from "../lang/messages/en/user.js";

class ReaderTextAreaManager {
  constructor() {
    this.container = document.querySelector("section");
    this.notes = [];
  }

  addElement(noteData) {
    const note = new Note(noteData.id, noteData.content);
    this.notes.push(note);
    this.container.appendChild(note.getElement());
  }

  clearSection() {
    this.container.innerHTML = "";
    this.notes = [];
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

    notes.forEach((noteData) => {
      this.readerTextAreaManager.addElement(noteData);
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
