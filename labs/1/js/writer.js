import { Navigation, Note } from "./common.js";
import { MESSAGES } from "../lang/messages/en/user.js";

class WriteTextAreaManager {
  constructor() {
    this.container = document.querySelector("section");
    this.idCounter = 0;
    this.notes = [];

    this.addButton = document.querySelector("#add-button");
    this.addButton.addEventListener("click", () => this.addElement());
    this.updateAddButtonState();
  }

  addElement() {
    const noteId = `textarea-${this.idCounter++}`;
    const note = new Note(noteId, "", (noteToDelete) =>
      this.deleteElement(noteToDelete)
    );

    // Add input event listener to update add button state
    note.addEventListener("input", () => this.updateAddButtonState());

    this.notes.push(note);
    this.container.appendChild(note.getElement());
    this.updateAddButtonState();
  }

  deleteElement(noteToDelete) {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const newNotes = notes.filter((note) => note.id !== noteToDelete.id);

    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour12: true,
    });
    this.addTimeStamp(timeNow);

    localStorage.setItem("notes", JSON.stringify(newNotes));

    // Remove from notes array
    this.notes = this.notes.filter((note) => note.id !== noteToDelete.id);

    // Remove from DOM
    noteToDelete.remove();
    this.updateAddButtonState();
  }

  addTimeStamp(time) {
    const timeStamp = document.querySelector("#timestamp");
    timeStamp.textContent = `${MESSAGES.writeTimeStamp} ${time}`;
  }

  updateAddButtonState() {
    if (this.notes.length === 0) {
      this.addButton.disabled = false;
      return;
    }
    const lastNote = this.notes[this.notes.length - 1];
    this.addButton.disabled = lastNote.getValue().trim() === "";
  }

  getAllNotes() {
    return this.notes;
  }
}

class SaveLocalStorage {
  constructor(writerTextAreaManager) {
    this.intervalId = null;
    this.writerTextAreaManager = writerTextAreaManager;
  }

  start(interval = 2000) {
    this.intervalId = setInterval(() => this.saveAll(), interval);
  }

  saveAll() {
    const notes = this.writerTextAreaManager
      .getAllNotes()
      .filter((note) => note)
      .map((note) => note.toJSON());

    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour12: true,
    });
    this.writerTextAreaManager.addTimeStamp(timeNow);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

class WriterApp {
  constructor() {
    const writerTextAreaManager = new WriteTextAreaManager();
    this.saveLocalStorage = new SaveLocalStorage(writerTextAreaManager);
    this.backButton = new Navigation();
  }

  run() {
    this.saveLocalStorage.start();
  }
}

new WriterApp().run();
